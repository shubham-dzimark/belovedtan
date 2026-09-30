"use client";

import { ActionBar, createUsePuck, Puck, useGetPuck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { IconStar, IconUnlink } from "@tabler/icons-react";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { fontVariables } from "@/app/fonts";
import { editorConfig, editorPermissions, type EditorMode } from "@/puck/editor-config";
import { canBeGlobal, globalIdFromType, globalType, type GlobalBlockInfo } from "@/puck/global-blocks";
import { createGlobalBlock } from "../actions";

const usePuckStore = createUsePuck();

type PendingReplace = {
  index: number;
  zone: string;
  data: { type: string; props: Record<string, unknown> };
  message: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "saving"; label: string }
  | { kind: "done"; label: string }
  | { kind: "error"; label: string };

type EditorApi = {
  liveUrl: string | null;
  previewUrl: string;
  isPublished: boolean;
  dirty: boolean;
  status: Status;
  save: (data: Data) => Promise<boolean>;
  mode: EditorMode;
  globalBlocks: GlobalBlockInfo[];
  /** Registers a new widget and restarts Puck (with `data`) so it appears in the block list. */
  addGlobalBlock: (block: GlobalBlockInfo, data: Data, then: PendingReplace) => void;
  /** Returns (and clears) the section swap queued by addGlobalBlock, once Puck has restarted. */
  takePendingReplace: () => PendingReplace | null;
  askName: (suggestion: string) => Promise<string | null>;
  notify: (label: string, kind?: "done" | "error") => void;
};

const EditorContext = createContext<EditorApi | null>(null);

const timeFormat = new Intl.DateTimeFormat("en", { timeStyle: "short" });

/**
 * Full-screen Puck editor used for pages and for the site header/footer.
 * The server page passes in bound server actions for saving and publishing.
 */
export function VisualEditor({
  mode,
  title,
  path,
  initialData,
  isPublished: initiallyPublished,
  liveUrl,
  previewUrl,
  saveAction,
  publishAction,
  globalBlocks: initialGlobalBlocks = [],
}: {
  mode: EditorMode;
  /** Saved global widgets, offered in the page editor's block list. */
  globalBlocks?: GlobalBlockInfo[];
  title: string;
  path?: string;
  initialData: Data;
  isPublished: boolean;
  liveUrl: string | null;
  previewUrl: string;
  saveAction: (data: Data) => Promise<{ savedAt: string }>;
  publishAction: (data: Data) => Promise<{ publishedAt: string }>;
}) {
  const [globalBlocks, setGlobalBlocks] = useState(initialGlobalBlocks);
  const config = useMemo(() => editorConfig(mode, globalBlocks), [mode, globalBlocks]);
  // Puck reads its block list once when it mounts, so a newly saved widget needs a restart
  // (same content, new key) before it shows up under "Global widgets".
  const [puckState, setPuckState] = useState({ key: 0, data: initialData });
  const pendingReplace = useRef<PendingReplace | null>(null);
  const addGlobalBlock = useCallback((block: GlobalBlockInfo, data: Data, then: PendingReplace) => {
    pendingReplace.current = then;
    setGlobalBlocks((list) => [...list, block]);
    setPuckState((state) => ({ key: state.key + 1, data }));
  }, []);
  const takePendingReplace = useCallback(() => {
    const next = pendingReplace.current;
    pendingReplace.current = null;
    return next;
  }, []);
  const [nameRequest, setNameRequest] = useState<{ suggestion: string; resolve: (name: string | null) => void } | null>(
    null,
  );
  const askName = useCallback(
    (suggestion: string) => new Promise<string | null>((resolve) => setNameRequest({ suggestion, resolve })),
    [],
  );
  const lastSaved = useRef(JSON.stringify(initialData));
  const [dirty, setDirty] = useState(false);
  const [isPublished, setIsPublished] = useState(initiallyPublished);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const save = useCallback(
    async (data: Data) => {
      setStatus({ kind: "saving", label: "Saving…" });
      try {
        const { savedAt } = await saveAction(data);
        lastSaved.current = JSON.stringify(data);
        setDirty(false);
        setStatus({ kind: "done", label: `Draft saved ${timeFormat.format(new Date(savedAt))}` });
        return true;
      } catch {
        setStatus({ kind: "error", label: "Save failed. Try again." });
        return false;
      }
    },
    [saveAction],
  );

  const publish = useCallback(
    async (data: Data) => {
      setStatus({ kind: "saving", label: "Publishing…" });
      try {
        const { publishedAt } = await publishAction(data);
        lastSaved.current = JSON.stringify(data);
        setDirty(false);
        setIsPublished(true);
        setStatus({ kind: "done", label: `Published ${timeFormat.format(new Date(publishedAt))}` });
      } catch {
        setStatus({ kind: "error", label: "Publish failed. Try again." });
      }
    },
    [publishAction],
  );

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const notify = useCallback((label: string, kind: "done" | "error" = "done") => setStatus({ kind, label }), []);

  const api = useMemo<EditorApi>(
    () => ({
      liveUrl,
      previewUrl,
      isPublished,
      dirty,
      status,
      save,
      mode,
      globalBlocks,
      addGlobalBlock,
      takePendingReplace,
      askName,
      notify,
    }),
    [
      liveUrl,
      previewUrl,
      isPublished,
      dirty,
      status,
      save,
      mode,
      globalBlocks,
      addGlobalBlock,
      takePendingReplace,
      askName,
      notify,
    ],
  );

  // Kept stable so Puck doesn't re-mount its header on every state change.
  const overrides = useMemo(
    () => ({
      headerActions: HeaderActions,
      iframe: CanvasFrame,
      ...(mode === "page" ? { actionBar: ItemActionBar } : {}),
    }),
    [mode],
  );

  return (
    <EditorContext.Provider value={api}>
      <Puck
        key={puckState.key}
        config={config}
        data={puckState.data}
        headerTitle={title}
        headerPath={path}
        permissions={editorPermissions(mode)}
        onChange={(data) => setDirty(JSON.stringify(data) !== lastSaved.current)}
        onPublish={publish}
        overrides={overrides}
      />
      {nameRequest && (
        <NameDialog
          suggestion={nameRequest.suggestion}
          onClose={(name) => {
            nameRequest.resolve(name);
            setNameRequest(null);
          }}
        />
      )}
    </EditorContext.Provider>
  );
}

/** Section toolbar in the page editor: Puck's buttons plus "Save as global widget" / "Detach". */
function ItemActionBar({
  label,
  children,
  parentAction,
}: {
  label?: string;
  children: ReactNode;
  parentAction: ReactNode;
}) {
  const editor = useContext(EditorContext)!;
  const selectedItem = usePuckStore((s) => s.selectedItem);
  const itemSelector = usePuckStore((s) => s.appState.ui.itemSelector);
  const dispatch = usePuckStore((s) => s.dispatch);
  const config = usePuckStore((s) => s.config);
  const getPuck = useGetPuck();

  const globalId = selectedItem ? globalIdFromType(selectedItem.type) : null;
  const block = globalId === null ? null : editor.globalBlocks.find((b) => b.id === globalId);
  const canSave = Boolean(selectedItem && canBeGlobal(config, selectedItem.type));

  const replaceSelected = (data: { type: string; props: Record<string, unknown> }) => {
    if (!itemSelector || itemSelector.zone === undefined) return;
    dispatch({
      type: "replace",
      destinationIndex: itemSelector.index,
      destinationZone: itemSelector.zone,
      data: data as never,
    });
  };

  const saveAsGlobal = async () => {
    if (!selectedItem) return;
    const suggestion = config.components[selectedItem.type]?.label ?? selectedItem.type;
    const name = await editor.askName(suggestion);
    if (!name) return;
    if (!itemSelector || itemSelector.zone === undefined) return;
    const { index, zone } = itemSelector;
    try {
      const { id: instanceId, ...props } = selectedItem.props as Record<string, unknown>;
      const created = await createGlobalBlock({ name, type: selectedItem.type, props });
      // Restart the editor with the current content so the widget shows in the block list, then
      // swap this section for a linked copy of the widget (same position, same instance id).
      editor.addGlobalBlock(created, getPuck().appState.data, {
        index,
        zone,
        data: { type: globalType(created.id), props: { id: instanceId } },
        message: `Saved “${name}” as a global widget. It's now in the block list of every page.`,
      });
    } catch {
      editor.notify("Couldn't save the global widget. Try again.", "error");
    }
  };

  const detach = () => {
    if (!selectedItem || !block) return;
    replaceSelected({ type: block.type, props: { ...structuredClone(block.props), id: selectedItem.props.id } });
    editor.notify(`Detached “${block.name}”: this copy now only changes on this page`);
  };

  return (
    // ActionBar prints the section name itself when given `label`.
    <ActionBar label={label}>
      {parentAction && <ActionBar.Group>{parentAction}</ActionBar.Group>}
      <ActionBar.Group>
        {canSave && (
          <ActionBar.Action onClick={() => void saveAsGlobal()} label="Save as global widget">
            <IconStar size={16} />
          </ActionBar.Action>
        )}
        {block && (
          <ActionBar.Action onClick={detach} label="Detach (edit on this page only)">
            <IconUnlink size={16} />
          </ActionBar.Action>
        )}
        {children}
      </ActionBar.Group>
    </ActionBar>
  );
}

/** Small modal asking for the new global widget's name. */
function NameDialog({ suggestion, onClose }: { suggestion: string; onClose: (name: string | null) => void }) {
  const [name, setName] = useState(suggestion);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.select();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="adm-dialog-backdrop" onMouseDown={() => onClose(null)}>
      <form
        className="adm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="global-name-title"
        onMouseDown={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) onClose(name.trim());
        }}
      >
        <h2 id="global-name-title">Save as global widget</h2>
        <p>
          Global widgets appear in the block list of every page. Editing one updates it everywhere it&rsquo;s used.
        </p>
        <label htmlFor="global-name">Widget name</label>
        <input
          id="global-name"
          ref={inputRef}
          value={name}
          maxLength={80}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Spring promo banner"
        />
        <div className="adm-dialog-actions">
          <button type="button" className="adm-btn" onClick={() => onClose(null)}>
            Cancel
          </button>
          <button type="submit" className="adm-btn adm-btn--primary" disabled={!name.trim()}>
            Save widget
          </button>
        </div>
      </form>
    </div>
  );
}

/** The canvas renders in an iframe; give it the same font classes as the live site. */
function CanvasFrame({ children, document }: { children: ReactNode; document?: Document }) {
  useEffect(() => {
    if (!document) return;
    const classes = fontVariables.split(" ");
    document.documentElement.classList.add(...classes);
  }, [document]);
  return <>{children}</>;
}

function HeaderActions({ children }: { children: ReactNode }) {
  const editor = useContext(EditorContext)!;
  const getPuck = useGetPuck();
  const dispatch = usePuckStore((s) => s.dispatch);
  const { save, takePendingReplace, notify } = editor;

  // After a restart for a newly saved global widget, swap the section for its linked copy.
  useEffect(() => {
    const pending = takePendingReplace();
    if (!pending) return;
    dispatch({
      type: "replace",
      destinationIndex: pending.index,
      destinationZone: pending.zone,
      data: pending.data as never,
    });
    notify(pending.message);
  }, [dispatch, takePendingReplace, notify]);

  const saveCurrent = useCallback(() => save(getPuck().appState.data), [getPuck, save]);

  // Ctrl/Cmd + S saves the draft.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void saveCurrent();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [saveCurrent]);

  const openPreview = async () => {
    // Open the tab synchronously so popup blockers allow it, then point it at the preview.
    const tab = window.open("about:blank", "_blank");
    if (await saveCurrent()) {
      if (tab) tab.location.href = editor.previewUrl;
    } else {
      tab?.close();
    }
  };

  const statusLabel =
    editor.status.kind !== "idle" && !(editor.dirty && editor.status.kind === "done")
      ? editor.status.label
      : editor.dirty
        ? "Unsaved changes"
        : "";

  return (
    <>
      {statusLabel && (
        <span className="adm-editor-status" role="status">
          {statusLabel}
        </span>
      )}
      <Link href="/admin" className="adm-btn adm-btn--sm">
        ← Dashboard
      </Link>
      {editor.isPublished && editor.liveUrl && (
        <a href={editor.liveUrl} target="_blank" rel="noreferrer" className="adm-btn adm-btn--sm">
          View live
        </a>
      )}
      <button type="button" className="adm-btn adm-btn--sm" onClick={openPreview}>
        Preview
      </button>
      <button
        type="button"
        className="adm-btn adm-btn--sm"
        onClick={() => void saveCurrent()}
        disabled={editor.status.kind === "saving"}
        title="Save draft (Ctrl+S)"
      >
        Save draft
      </button>
      {children}
    </>
  );
}

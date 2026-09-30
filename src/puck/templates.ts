import type { Data } from "@puckeditor/core";

export const emptyPageData: Data = { content: [], root: { props: {} } };

export const homePageData: Data = {
  root: { props: {} },
  content: [
    {
      type: "Section",
      props: {
        id: "Section-hero",
        background: "#f5f3ff",
        paddingY: 96,
        maxWidth: 960,
        content: [
          {
            type: "Heading",
            props: {
              id: "Heading-hero",
              text: "Welcome to BelovedTan",
              level: "h1",
              align: "center",
              color: "#1e1b4b",
            },
          },
          {
            type: "Text",
            props: {
              id: "Text-hero",
              text: "This page was built with the drag-and-drop editor. Sign in at /admin to change it.",
              align: "center",
              color: "#4b5563",
              size: 18,
            },
          },
          {
            type: "Button",
            props: {
              id: "Button-hero",
              label: "Open admin panel",
              href: "/admin",
              variant: "primary",
              align: "center",
            },
          },
        ],
      },
    },
  ],
};

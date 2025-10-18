import Image from "@tiptap/extension-image";
import { Node } from "@tiptap/core";

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute("width"),
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }
          return { width: attributes.width };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute("height"),
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {};
          }
          return { height: attributes.height };
        },
      },
    };
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const container = document.createElement("div");
      container.className = "image-resizer";
      container.style.position = "relative";
      container.style.display = "inline-block";
      container.style.maxWidth = "100%";

      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || "";
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      img.style.display = "block";

      if (node.attrs.width) {
        img.style.width = node.attrs.width + "px";
      }
      if (node.attrs.height) {
        img.style.height = node.attrs.height + "px";
      }

      container.appendChild(img);

      // Add resize handle
      if (editor.isEditable) {
        const resizeHandle = document.createElement("div");
        resizeHandle.className = "resize-handle";
        resizeHandle.style.position = "absolute";
        resizeHandle.style.right = "0";
        resizeHandle.style.bottom = "0";
        resizeHandle.style.width = "12px";
        resizeHandle.style.height = "12px";
        resizeHandle.style.backgroundColor = "#3B82F6";
        resizeHandle.style.cursor = "nwse-resize";
        resizeHandle.style.borderRadius = "2px";
        resizeHandle.style.display = "none";

        container.addEventListener("mouseenter", () => {
          resizeHandle.style.display = "block";
        });

        container.addEventListener("mouseleave", () => {
          resizeHandle.style.display = "none";
        });

        let isResizing = false;
        let startX = 0;
        let startY = 0;
        let startWidth = 0;
        let startHeight = 0;

        resizeHandle.addEventListener("mousedown", (e) => {
          e.preventDefault();
          isResizing = true;
          startX = e.clientX;
          startY = e.clientY;
          startWidth = img.offsetWidth;
          startHeight = img.offsetHeight;

          const onMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;

            const deltaX = e.clientX - startX;
            const aspectRatio = startWidth / startHeight;
            const newWidth = startWidth + deltaX;
            const newHeight = newWidth / aspectRatio;

            img.style.width = newWidth + "px";
            img.style.height = newHeight + "px";
          };

          const onMouseUp = () => {
            if (isResizing) {
              isResizing = false;
              const pos = getPos();
              if (typeof pos === "number") {
                editor.commands.updateAttributes("image", {
                  width: img.offsetWidth,
                  height: img.offsetHeight,
                });
              }
            }
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          };

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        });

        container.appendChild(resizeHandle);
      }

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== "image") {
            return false;
          }
          img.src = updatedNode.attrs.src;
          if (updatedNode.attrs.width) {
            img.style.width = updatedNode.attrs.width + "px";
          }
          if (updatedNode.attrs.height) {
            img.style.height = updatedNode.attrs.height + "px";
          }
          return true;
        },
      };
    };
  },
});

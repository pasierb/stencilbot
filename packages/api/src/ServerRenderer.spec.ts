import { mock, reset, instance } from "ts-mockito";
import { Project, Layer } from "@stencilbot/renderer";
import { ServerRenderer } from "./ServerRenderer";
import { ImageProvider } from "./ImageProvider";
import { FontProvider } from "./FontProvider";

describe("ServerRenderer", () => {
  const FontProviderMock = mock(FontProvider);
  const ImageProviderMock = mock(ImageProvider);

  beforeEach(() => {
    reset(FontProviderMock);
    reset(ImageProviderMock);
  });

  describe("render", () => {
    it("renders without errors", async () => {
      const project = new Project(300, 300, [
        new Layer({
          bg: "#000000"
        })
      ]);
      const renderer = getRenderer(project);

      expect(async () => await renderer.render()).not.toThrowError();
    });
  });

  function getRenderer(project: Project) {
    const renderer = new ServerRenderer(
      project,
      instance(FontProviderMock),
      instance(ImageProviderMock)
    );

    return renderer;
  }
});

import html2canvas from "html2canvas";

async function exportAsImage(element, imageFileName) {
  const canvas = await html2canvas(element);
  const image = canvas.toDataURL("image/png", 1.0);
  downloadImage(image, imageFileName);
}

function downloadImage(blob, fileName) {
  const fakeLink = window.document.createElement("a");
  fakeLink.style =
    "display:none;position:absolute;top:" +
    window.innerHeight +
    ";left:" +
    window.innerWidth +
    ";";
  fakeLink.download = fileName;

  fakeLink.href = blob;

  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);

  fakeLink.remove();
}

export default exportAsImage;

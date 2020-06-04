import {format} from 'date-fns';
//-------------------------------------

export const genSVG = content => {
  return `<svg width="100" height="100" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
};

export const svgToPng = async ({width, height, svg}) => {
  const widthIn300DPI = (width * 300) / 72;
  const heightIn300DPI = (height * 300) / 72;

  return new Promise((resolve, reject) => {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = svg;
    let svgnode = wrapper.querySelectorAll('svg')[0];
    svgnode.setAttribute('width', widthIn300DPI);
    svgnode.setAttribute('height', heightIn300DPI);
    svg = svgnode.outerHTML;

    let img = new Image();
    img.onload = () => {
      let canvas = document.createElement('canvas');
      canvas.width = widthIn300DPI;
      canvas.height = heightIn300DPI;
      let cxt = canvas.getContext('2d');
      cxt.drawImage(img, 0, 0);
      canvas.toBlob(
        blob => {
          var reader = new FileReader();
          reader.onload = () => {
            let result = reader.result;
            resolve(result);
          };
          reader.readAsDataURL(blob);
        },
        {type: 'image/png'},
      );
    };
    img.onerror = e => {
      console.error(e);
      // reject(e);
      resolve(null);
    };
    let svgUrl = 'data:image/svg+xml,' + encodeURIComponent(svg);
    img.src = svgUrl;
  });
};

export const replaceDateOnStamp = svg => {
  let wrapper = document.createElement('div');
  wrapper.innerHTML = svg;
  let svgnode = wrapper.querySelectorAll('svg')[0];
  let snode = svgnode.getElementById('stamp-manager-date');
  if (snode) {
    snode.innerHTML = format(new Date(), 'yy.MM.dd');
  }
  return svgnode.outerHTML;
};

export const moveInArray = (array, fromIndex, toIndex) => {
  array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
};

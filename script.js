const defaultColor = [255, 255, 255];

const createAssets = (id = null, canvas = null, context = null, layer = null) => ({ id, canvas, context, layer });

const assets = {
    coloring: createAssets('coloring'),
    markings: createAssets('markings'),
    lineart: createAssets('lineart'),
    shading: createAssets('shading')
}

const initialize = () => {
    const keys = Object.keys(assets);

    const assignElements = (key) => {
        const canvas = document.getElementById(`${assets[key].id}Canvas`);
        const context = canvas.getContext('2d');
        const layer = document.getElementById(`wolf${capitalizeFirstLetter(assets[key].id)}`);
        assets[key] = createAssets(assets[key].id, canvas, context, layer);
    }

    const setDimensions = (key) => {
        assets[key].canvas.width = assets.coloring.layer.width;
        assets[key].canvas.height = assets.coloring.layer.height;
    }

    keys.forEach(key => { 
        assignElements(key);
        setDimensions(key);

        assets[key].context.drawImage(assets[key].layer, 0, 0, assets[key].layer.width, assets[key].layer.height);
    });

    changeColor(assets.coloring.context, assets.coloring.canvas, assets.coloring.layer);
}

const changeColor = (context, canvas, layer, color = defaultColor) => {
    let imageData = context.getImageData(0, 0, assets.coloring.layer.width, assets.coloring.layer.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] !== 0) {
            data[i] = color[0];
            data[i + 1] = color[1];
            data[i + 2] = color[2];
            data[i + 3] = 255;
        }
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    var scale = Math.min(canvas.width / layer.width, layer.height / layer.height);
    var x = (canvas.width / 2) - (layer.width / 2) * scale;
    var y = (canvas.height / 2) - (layer.height / 2) * scale;
    context.putImageData(imageData, x, y, x, y, canvas.width, canvas.height);
}

const onBaseColorSelected = (event) => changeColor(assets.coloring.context, assets.coloring.canvas, assets.coloring.layer, hexToRgb(event.target.value))

const onMarkingsColorSelected = (event) => changeColor(assets.markings.context, assets.markings.canvas, assets.markings.layer, hexToRgb(event.target.value))

// https://stackoverflow.com/a/39077686
const hexToRgb = hex =>
    hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
        , (m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map(x => parseInt(x, 16))

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('')

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
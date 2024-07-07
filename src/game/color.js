export class TileColor {
    static getColor(value) {
        const colorsPerHueCycle = 7;  // Increase the number of colors per hue cycle for more variety
        let index = Math.floor(Math.log2(value));
        index %= colorsPerHueCycle;
        
        const hue = (index / colorsPerHueCycle) * 270;
        const hueNoise = ((value << 3) % 90) / 100;  // Adjust noise calculation for smoother variations

        const saturationBase = 70;
        const saturationRange = 30;  // Range for saturation to vary
        const minValue = 2;
        const maxValue = 2048;
        
        // Saturation varies based on the tile value, with a base and a range for variation
        let saturation = saturationBase + (value - minValue) / (maxValue - minValue) * saturationRange;
        saturation = Math.min(saturation, 100);
        
        const lightnessBase = 50;
        const lightnessRange = 10;  // Adjust lightness for better visual contrast
        let lightness = lightnessBase + (value - minValue) / (maxValue - minValue) * lightnessRange;
        lightness = Math.min(lightness, 70);

        return `hsl(${hue + hueNoise}, ${saturation}%, ${lightness}%)`;
    }
}


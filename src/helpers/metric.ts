import { Dimensions } from "react-native";


const { width, height } = Dimensions.get('window');


const guidelineBaseHeight = 812;
const guidelineBaseWidth = 375;

const hscale = (size: number): number => height / guidelineBaseHeight * size;
const wscale = (size: number): number => width / guidelineBaseWidth * size;
const mscale = (size: number, factor = 0.5): number => size + (hscale(size) - size) * factor;

export { hscale, wscale, mscale }
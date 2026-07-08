import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

/** Pre-configured shimmer box. Use like a View with width/height/style props. */
const Shimmer = createShimmerPlaceholder(LinearGradient);

export default Shimmer;

export default (config) => {
  // Resolve .tsx and .ts extensions
  config.resolve.extensions.push('.ts', '.tsx')
  config.node = {
    process: true,
  };
  // Additional configurations can be added here
}

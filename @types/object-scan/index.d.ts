declare module 'object-scan' {
  const objectScan: (patterns: string[], options?: object) => (obj: any) => any;
  export default objectScan;
}
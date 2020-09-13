export const loadScript = (url: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const script = window.document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => reject());
    window.document.head.appendChild(script);
  });
};

export const loadScripts = async (urls: string[]): Promise<boolean[]> => {
  return Promise.all(urls.map(loadScript));
};

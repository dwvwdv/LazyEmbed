/**
 * LazyEmbed Cloudflare Worker
 * 處理靜態資產並提供額外的路由功能
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 處理根路徑，返回 index.html
    if (url.pathname === '/') {
      try {
        const asset = await env.ASSETS.fetch(new URL('/index.html', request.url));
        return new Response(asset.body, {
          headers: {
            'Content-Type': 'text/html;charset=UTF-8',
            'Cache-Control': 'public, max-age=3600',
            ...Object.fromEntries(asset.headers)
          }
        });
      } catch (e) {
        return new Response('Not Found', { status: 404 });
      }
    }

    // 嘗試從靜態資產中獲取文件
    try {
      const asset = await env.ASSETS.fetch(request);

      // 根據文件類型設置正確的 Content-Type
      const headers = new Headers(asset.headers);
      const pathname = url.pathname.toLowerCase();

      if (pathname.endsWith('.html')) {
        headers.set('Content-Type', 'text/html;charset=UTF-8');
      } else if (pathname.endsWith('.css')) {
        headers.set('Content-Type', 'text/css;charset=UTF-8');
      } else if (pathname.endsWith('.js')) {
        headers.set('Content-Type', 'application/javascript;charset=UTF-8');
      } else if (pathname.endsWith('.json')) {
        headers.set('Content-Type', 'application/json;charset=UTF-8');
      } else if (pathname.endsWith('.png')) {
        headers.set('Content-Type', 'image/png');
      } else if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) {
        headers.set('Content-Type', 'image/jpeg');
      } else if (pathname.endsWith('.svg')) {
        headers.set('Content-Type', 'image/svg+xml');
      }

      // 設置緩存策略
      headers.set('Cache-Control', 'public, max-age=3600');

      // 添加安全標頭
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Frame-Options', 'SAMEORIGIN');
      headers.set('X-XSS-Protection', '1; mode=block');

      return new Response(asset.body, {
        status: asset.status,
        headers
      });
    } catch (e) {
      // 如果資產不存在，返回 404 或 fallback 到 index.html
      // 對於某些路徑，我們可能想要 fallback 到 index.html
      if (!url.pathname.includes('.')) {
        try {
          const indexAsset = await env.ASSETS.fetch(new URL('/index.html', request.url));
          return new Response(indexAsset.body, {
            headers: {
              'Content-Type': 'text/html;charset=UTF-8',
              'Cache-Control': 'public, max-age=3600'
            }
          });
        } catch (indexError) {
          return new Response('Not Found', { status: 404 });
        }
      }

      return new Response('Not Found', { status: 404 });
    }
  }
};

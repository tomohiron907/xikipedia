let articlesLoaded = 0;

// 日本語のWikipedia記事を取得する関数
async function getRandomJaWikiArticle() {
  const response = await fetch('https://ja.wikipedia.org/api/rest_v1/page/random/summary');
  const data = await response.json();
  return data;
}

// 記事の画像URLを取得する関数
async function getArticleImageURL(title) {
  const response = await fetch(`https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
  const data = await response.json();
  return data.thumbnail ? data.thumbnail.source : null;
}

// 次の10件の記事を読み込む関数
async function loadMoreArticles() {
    const timeline = document.getElementById('timeline');
  
    for (let i = 0; i < 10; i++) {
        const article = await getRandomJaWikiArticle();
        const articleElement = document.createElement('div');
        articleElement.classList.add('article');
    
        const titleWrapper = document.createElement('div');
        titleWrapper.classList.add('article-title-wrapper');
    
        // 記事の画像URLを取得し、サムネイル画像要素を作成
        const imageURL = await getArticleImageURL(article.title);
        if (imageURL) {
          const thumbnailElement = document.createElement('img');
          thumbnailElement.src = imageURL;
          thumbnailElement.classList.add('article-image-thumbnail');
          titleWrapper.appendChild(thumbnailElement);
        }
    
        const titleElement = document.createElement('h3');
        titleElement.classList.add('article-title');
        titleElement.textContent = article.title;
        titleWrapper.appendChild(titleElement);
    
        const extractElement = document.createElement('p');
        extractElement.textContent = article.extract;
    
        articleElement.appendChild(titleWrapper);
        articleElement.appendChild(extractElement);
        timeline.appendChild(articleElement);

      if (imageURL) {
        const imageElement = document.createElement('img');
        imageElement.src = imageURL;
        imageElement.classList.add('article-image');
        articleElement.appendChild(imageElement);
      }
    }
  
    articlesLoaded += 10;
  }

// スクロール位置を監視する関数
function handleScroll() {
  const timeline = document.getElementById('timeline');
  const timelineHeight = timeline.offsetHeight;
  const scrollPosition = window.innerHeight + window.pageYOffset;
  const isBottomReached = scrollPosition >= timelineHeight;

  if (isBottomReached) {
    loadMoreArticles();
  }
}

// タイムラインを表示する関数
// タイムラインを表示する関数
async function displayTimeline() {
    // 既にスクロールイベントリスナーが登録されている場合は削除する
    window.removeEventListener('scroll', handleScroll);
  
    await loadMoreArticles();
  
    window.addEventListener('scroll', handleScroll);
  }

// タイムラインを表示する
displayTimeline();
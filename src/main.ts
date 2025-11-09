import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <h2 class="title">曲とアンサー音のズレ計算ツール</h2>
    <p>simai形式の譜面データから、曲とノーツのアンサー音とのズレを計算します。</p>
    <a class="link" href="https://w.atwiki.jp/simai/pages/32.html">ST譜面（simai wikiへ）</a>
    <a class="link" href="https://w.atwiki.jp/simai/pages/808.html">DX譜面（simai wikiへ）</a>
    <textarea placeholder="simai形式の譜面データをここに貼り付けてください"></textarea><br/>
    <button>計算</button>
  </div>
`

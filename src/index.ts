import './style.css'
import { main } from './scripts/main.js'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">

    <h2 class="title">アンサー音ズレ計算ツール</h2>
    <p>simai形式の譜面データから、曲とアンサー音とのズレを計算します。</p>
    <a class="link" href="https://w.atwiki.jp/simai/pages/32.html" target="_blank">ST譜面（simai wikiへ）</a>
    <a class="link" href="https://w.atwiki.jp/simai/pages/808.html" target="_blank">DX譜面（simai wikiへ）</a>
    <br/>
    <h3>操作方法</h3>
    <ol>
      <li>simai形式の譜面データをテキストエリアに貼り付けます。</li>
      <li>simaiデータ開始までの時間と、判定Aオフセットを入力します。</li>
      <li>譜面データ内で選択範囲を指定すると、表にノーツごとの判定誤差が表示されます。<br/>（選択モードにするとテキストが編集不可になり、ノーツを選択しやすくなります。）</li>
    </ol>

    <h3>simaiデータ開始までの時間</h3>
    <p>曲が始まる前の「カッカッ…（以下、メトロノームガイド）」開始時から、simaiデータの１番最初のノーツ（カンマ）までにかかる時間を設定します。<br/>BPMいくつの四分音符が何個分かで入力してください。</p>
    <p>例１：BPMが150でメトロノームガイドは4/4拍子、ガイド終了から最初のノーツまでが1小節の場合…BPM:150 個数:8</p>
    <p>例２：BPMが130でメトロノームガイドは7/8拍子、ガイド終了から最初のノーツまでが16分音符5つ分の場合…BPM:130 個数:4.75、BPM:520 個数:19 など</p>
    <p style="color: gray; font-size: small;">小数値や負の数を入力できますが、扱いには注意してください。</p>
    <label for="bpm-offset">BPM:</label> <input type="number" id="offset-bpm" value="120" min="1" /><br/>
    <label for="count">個数:</label> <input type="number" id="offset-count" value="0" min="0" />

    <h3>判定の中心</h3>
    <p>あなたが思うこの曲の判定の中心を入力してください。</p>
    <p>入力する値は判定A調整後の値にしてください。</p>
    <p>例：+0.1と入力した場合、判定誤差の範囲が-0.4~+0.6として表示されます。</p>
    <input type="number" id="offset-center" value="0" step="0.01"/>


    <div id="mode-switcher" style="margin-top: 1em;">
      <input type="radio" id="mode-edit" name="mode" value="edit" checked/>
      <label for="mode-edit">編集モード</label>
      <input type="radio" id="mode-select" name="mode" value="select"/>
      <label for="mode-select">選択モード</label>
    </div>

    <h3>simai形式の譜面データ</h3>
    <textarea id="input" placeholder="simai形式の譜面データをここに貼り付けてください"></textarea><br/>
   
    <h3>計算結果</h3>
    <p>判定誤差がマイナスなら早く叩く必要があり、プラスなら遅く叩く必要があります。</p>
    <input type="checkbox" id="break" />
    <label for="break">ブレイクのみ表示</label>
    <button id="csv-export">CSV出力</button>

    <table>
      <thead>
        <tr>
          <th>ノーツ数</th>
          <th>simai書式</th>
          <th>判定誤差(f)</th>
        </tr>
      </thead>
      <tbody id="res-body">
        <tr>
          <td>--</td>
          <td>--</td>
          <td>--</td>
        </tr>
      </tbody>
    </table>
  </div>
`



main(
  {
    edit: document.querySelector('input#mode-edit')!,
    select: document.querySelector('input#mode-select')!,
  },
  {
    bpm: document.querySelector('input#offset-bpm')!,
    count: document.querySelector('input#offset-count')!,
    center: document.querySelector('input#offset-center')!,
  },
  document.querySelector('textarea#input')!,
  document.querySelector('tbody#res-body')!,
  document.querySelector('input#break')!,
  document.querySelector('button#csv-export')!,
)
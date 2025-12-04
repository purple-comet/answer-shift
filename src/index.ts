import './style.css'
import { main } from './scripts/main.js'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
    <div class="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-3xl font-bold text-gray-800 mb-2">アンサー音ズレ計算ツール</h2>
        <p class="text-gray-600 mb-4">simai形式の譜面データから、曲とアンサー音とのズレを計算します。</p>
        <div class="flex gap-4 text-sm">
          <a class="text-primary hover:text-primary-dark underline" href="https://w.atwiki.jp/simai/pages/32.html" target="_blank">ST譜面（simai wikiへ）</a>
          <a class="text-primary hover:text-primary-dark underline" href="https://w.atwiki.jp/simai/pages/808.html" target="_blank">DX譜面（simai wikiへ）</a>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 class="text-xl font-bold text-gray-800 mb-3">操作方法</h3>
        <ol class="list-decimal list-inside space-y-2 text-gray-700">
          <li>simai形式の譜面データをテキストエリアに貼り付けます。</li>
          <li>simaiデータ開始までの時間と、判定Aオフセットを入力します。</li>
          <li>譜面データ内で選択範囲を指定すると、表にノーツごとの判定誤差が表示されます。<br/>（選択モードにするとテキストが編集不可になり、ノーツを選択しやすくなります。）</li>
        </ol>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 class="text-xl font-bold text-gray-800 mb-3">simaiデータ開始までの時間</h3>
        <p class="text-gray-700 mb-3">曲が始まる前の「カッカッ…（以下、メトロノームガイド）」開始時から、simaiデータの１番最初のノーツ（カンマ）までにかかる時間を設定します。<br/>BPMいくつの四分音符が何個分かで入力してください。</p>
        <div class="bg-blue-50 rounded p-4 mb-3 space-y-2 text-sm text-gray-700">
          <p><span class="font-semibold">例１：</span>BPMが150でメトロノームガイドは4/4拍子、ガイド終了から最初のノーツまでが1小節の場合…BPM:150 個数:8</p>
          <p><span class="font-semibold">例２：</span>BPMが130でメトロノームガイドは7/8拍子、ガイド終了から最初のノーツまでが16分音符5つ分の場合…BPM:130 個数:4.75やBPM:520 個数:19 など</p>
        </div>
        <p class="text-gray-500 text-sm mb-4">小数値や負の数を入力できますが、扱いには注意してください。</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="offset-bpm" class="block text-sm font-medium text-gray-700 mb-1">BPM:</label>
            <input type="number" id="offset-bpm" value="120" min="1" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <div>
            <label for="offset-count" class="block text-sm font-medium text-gray-700 mb-1">個数:</label>
            <input type="number" id="offset-count" value="0" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 class="text-xl font-bold text-gray-800 mb-3">判定の中心</h3>
        <p class="text-gray-700 mb-3">あなたが思うこの曲の判定の中心を入力してください。<br/>入力する値は判定A調整後の値にしてください。</p>
        <p class="text-gray-600 text-sm mb-4">例：+0.1と入力した場合、判定誤差の範囲が-0.4~+0.6として表示されます。</p>
        <input type="number" id="offset-center" value="0" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 class="text-xl font-bold text-gray-800 mb-3">simai形式の譜面データ</h3>
        <div class="mb-4">
          <div class="inline-flex rounded-md shadow-sm mb-3" role="group">
            <label class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-white has-[:checked]:border-primary">
              <input type="radio" id="mode-edit" name="mode" value="edit" checked class="sr-only" />
              編集モード
            </label>
            <label class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-white has-[:checked]:border-primary">
              <input type="radio" id="mode-select" name="mode" value="select" class="sr-only" />
              選択モード
            </label>
          </div>
        </div>
        <textarea id="input" placeholder="simai形式の譜面データをここに貼り付けてください" class="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"></textarea>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-3">計算結果</h3>
        <p class="text-gray-700 mb-4">判定誤差がマイナスなら早く叩く必要があり、プラスなら遅く叩く必要があります。</p>
        <div class="flex items-center gap-4 mb-4">
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" id="break" class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
            <span class="ml-2 text-sm font-medium text-gray-700">ブレイクのみ表示</span>
          </label>
          <button id="csv-export" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors">
            CSV出力
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-primary text-white">
                <th class="px-4 py-3 text-left font-semibold">ノーツ数</th>
                <th class="px-4 py-3 text-left font-semibold">simai書式</th>
                <th class="px-4 py-3 text-left font-semibold">判定誤差(f)</th>
              </tr>
            </thead>
            <tbody id="res-body" class="divide-y divide-gray-200">
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-gray-700">--</td>
                <td class="px-4 py-3 text-gray-700">--</td>
                <td class="px-4 py-3 text-gray-700">--</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
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
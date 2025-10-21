document.addEventListener("DOMContentLoaded", function () {
  // 質問データの定義（50個の質問）
  const questionsData = [
    // 1-10: 挑戦と変化
    "新しい挑戦にワクワクしますか？", "予測不能な状況でも落ち着いていられますか？", 
    "計画通りに進まないとき、すぐに別の方法を考えられますか？", "リスクを取ることに対して前向きですか？",
    "ルーティンワークよりも変化を求めますか？", "失敗から学び、立ち直るのは早い方ですか？",
    "自分のアイデアを積極的に発信しますか？", "技術の進化についていくのが好きですか？",
    "他人の助けを借りる前に、自分で解決しようとしますか？", "自分の意見と異なる考えでも、まずは受け入れられますか？",

    // 11-20: 論理と分析
    "物事を論理的に順序立てて考えるのが得意ですか？", "データや数字に基づいた判断を重視しますか？",
    "複雑な問題を小さな要素に分解して考えますか？", "間違いを見つけるのが得意ですか？",
    "感情的になるよりも客観的に判断を下しますか？", "原因と結果の関係を深く探求したいですか？",
    "規則やルールを守ることに価値を感じますか？", "詳細な文書やマニュアルを読むのは苦になりませんか？",
    "結論を出す前に、すべての選択肢を検討しますか？", "不確実性よりも確実性を求めますか？",

    // 21-30: コミュニケーションと協調性
    "初対面の人ともすぐに打ち解けられますか？", "チームでの活動でリーダーシップを発揮したいですか？",
    "他人の感情や気持ちを察するのは得意ですか？", "自分の意見を相手に合わせて調整できますか？",
    "人を指導したり、教えたりすることに喜びを感じますか？", "対立や議論を避ける傾向がありますか？",
    "人の話を最後まで遮らずに聞けますか？", "グループの調和を乱さないように努めますか？",
    "社交的なイベントに参加するのは好きですか？", "自分の考えを明確に伝えるための努力をしますか？",

    // 31-40: 創造性とデザイン
    "ゼロから何か新しいものを生み出すことに興味がありますか？", "既存の枠にとらわれない自由な発想を大切にしますか？",
    "芸術やデザインに関心がありますか？", "細部にまでこだわって作品を仕上げたいですか？",
    "直感に従って行動することが多いですか？", "美しいものや、人を楽しませるものを作ることに喜びを感じますか？",
    "視覚的な情報を整理したり、見やすくしたりするのが得意ですか？", "想像力や空想にふける時間が必要ですか？",
    "新しい表現方法やツールを試すのが好きですか？", "ルールよりも自由な表現を優先しますか？",

    // 41-50: 安定性とサービス
    "安定した環境で長く働き続けたいですか？", "誰かの役に立ったり、サポートすることに満足感を得ますか？",
    "期限や約束は必ず守るように心がけていますか？", "人の期待に応えることが重要だと考えますか？",
    "奉仕活動やボランティアに興味がありますか？", "自分の仕事が社会に貢献していると感じたいですか？",
    "衝動的な行動はほとんど取りませんか？", "他人に感謝されるとやりがいを感じますか？",
    "周囲からの信頼を何よりも大切にしますか？", "公的なルールや規範を尊重しますか？"
  ];

  const questions = questionsData.map((text, i) => ({
    id: i + 1,
    text: `質問 ${i + 1}：${text}`
  }));

  let current = 0;
  const answers = new Array(50).fill(null);

  // HTML要素の取得
  const qText = document.getElementById("questionText");
  const choices = document.getElementById("choices");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const finishBtn = document.getElementById("finishBtn");
  const progressBar = document.getElementById("progressBar");
  const progressLabel = document.getElementById("progressLabel");
  const resultArea = document.getElementById("resultArea");
  const topResults = document.getElementById("topResults");
  const warning = document.getElementById("warning");

  const options = [
    "非常に当てはまる",
    "やや当てはまる",
    "どちらともいえない",
    "あまり当てはまらない",
    "全く当てはまらない"
  ];

  // 診断結果の定義 (24タイプが必要なため、デバッグ用のダミーを追加)
  const baseCareerTypes = [
    { name: "公務員タイプ", desc: "安定と信頼の守護犬。", jobs: "地方公務員 / 教師", img: "images/dog-government.png" },
    { name: "弁護士タイプ", desc: "正義感が強い法廷犬。", jobs: "弁護士 / 法務", img: "images/dog-lawyer.png" },
    { name: "IT系タイプ", desc: "技術革新に強いテック犬。", jobs: "エンジニア / データ分析", img: "images/dog-it.png" },
    { name: "コンサルタイプ", desc: "戦略家のゴールデンドッグ。", jobs: "コンサル / 企画", img: "images/dog-consultant.png" },
    { name: "Webデザイナータイプ", desc: "創造力豊かなデザイン犬。", jobs: "デザイナー", img: "images/dog-designer.png" }
  ];
  // 24タイプを確保するためにダミーを追加
  const dummyTypes = Array.from({ length: 24 - baseCareerTypes.length }, (_, i) => ({
    name: `その他タイプ ${i + 6}`, desc: "データ不足によるランダムタイプ。", jobs: "（データ追加推奨）", img: "images/dog-placeholder.png"
  }));
  const careerTypes = [...baseCareerTypes, ...dummyTypes];

  // 質問画面の描画
  function renderQuestion() {
    const q = questions[current];
    qText.textContent = `${q.id}. ${q.text}`;
    choices.innerHTML = "";

    options.forEach((opt, i) => {
      const div = document.createElement("div");
      div.className = "choice";
      if (answers[current] === i) div.classList.add("selected");

      const tab = document.createElement("div");
      tab.className = "choice-tab";
      const text = document.createElement("div");
      text.textContent = opt;

      div.appendChild(tab);
      div.appendChild(text);

      div.addEventListener("click", () => {
        answers[current] = i;
        warning.style.display = "none"; // 回答を選んだら警告を非表示
        renderQuestion();
      });

      choices.appendChild(div);
    });

    // プログレスバーの更新
    const progress = Math.round(((current + 1) / questions.length) * 100);
    progressBar.style.width = progress + "%";
    progressLabel.textContent = `${current + 1} / 50（${progress}%）`;

    // ボタンの表示制御
    prevBtn.style.display = current === 0 ? "none" : "inline-block";
    nextBtn.style.display = current === 49 ? "none" : "inline-block";
    finishBtn.style.display = current === 49 ? "inline-block" : "none";
  }

  // 「次へ」ボタン
  nextBtn.addEventListener("click", () => {
    if (answers[current] === null) {
      warning.style.display = "block";
      return;
    }
    if (current < 49) {
      current++;
      renderQuestion();
    }
  });

  // 「戻る」ボタン
  prevBtn.addEventListener("click", () => {
    if (current > 0) {
      current--;
      renderQuestion();
    }
  });

  // 「結果を見る」ボタン
  finishBtn.addEventListener("click", () => {
    if (answers[current] === null) {
      warning.style.display = "block";
      return;
    }

    // スコア計算: 「非常に当てはまる(0)」=5点 ～ 「全く当てはまらない(4)」=1点
    const totalScore = answers.reduce((sum, a) => sum + (a !== null ? 5 - a : 0), 0);
    
    // スコアからタイプを決定 (24タイプから剰余で選択)
    const index = totalScore % careerTypes.length; // careerTypes.lengthは現在24
    const result = careerTypes[index];

    topResults.innerHTML = `
      <div class="result-card">
        <h2>${result.name}</h2>
        <img class="result-image" src="${result.img}" alt="${result.name}">
        <p>${result.desc}</p>
        <p><strong>おすすめ職業：</strong>${result.jobs}</p>
      </div>
    `;

    resultArea.style.display = "block";
    // 結果エリアまでスムーズにスクロール
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  });

  // アプリケーション開始
  renderQuestion();
});

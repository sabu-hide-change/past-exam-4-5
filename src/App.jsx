// npm install firebase lucide-react

import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { Home, Check, X, Star, List, RotateCcw, BookOpen, ChevronRight, AlertCircle } from "lucide-react";

// ============================================================
// ★ Firebase設定 — 以下の値を本番の設定値に書き換えてください ★
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyCyo4bAZwqaN2V0g91DehS6mHmjZD5XJTc",
  authDomain: "sabu-hide-web-app.firebaseapp.com",
  projectId: "sabu-hide-web-app",
  storageBucket: "sabu-hide-web-app.firebasestorage.app",
  messagingSenderId: "145944786114",
  appId: "1:145944786114:web:0da0c2d87a9e24ca6cf75b",
  measurementId: "G-XSS72H1ZKV"
};

// このアプリ固有のコレクション名（アプリごとに変更して混在を防止）
const APP_ID = "past-exam-4-5";

// Firebase初期化
let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("[Firebase] 初期化完了");
} catch (e) {
  console.error("[Firebase] 初期化エラー:", e);
}

// ============================================================
// 問題データ（全24問）
// ============================================================
const LABELS = ["ア", "イ", "ウ", "エ", "オ"];

const QUESTIONS = [
  {
    id: 1,
    title: "バランスト・スコアカード",
    year: "令和元年 第21問",
    question:
      "Ｒ．Ｓ．キャプランとＤ．Ｐ．ノートンが開発したバランスト・スコアカード（BSC）は、情報通信技術（ICT）投資の評価手法の1つとして使われることがある。BSCでは4つの視点から評価するとされているが、この4つの視点に含まれないものはどれか。",
    choices: [
      "学習と成長の視点",
      "競合企業の視点",
      "業務プロセスの視点",
      "顧客の視点",
      "財務の視点",
    ],
    correctIndex: 1,
    explanation: `BSCは「財務」「顧客」「業務プロセス」「学習と成長」の4つの視点から評価・検討する手法です。

【ア】学習と成長の視点 → BSCの4つの視点の1つ。将来性に関する視点（従業員満足度・研修費用・改善提案数など）→ 適切
【イ】競合企業の視点 → BSCの4つの視点に含まれない → ★正解（不適切）
【ウ】業務プロセスの視点 → BSCの4つの視点の1つ。現状に関する視点（原価率・不良品率など）→ 適切
【エ】顧客の視点 → BSCの4つの視点の1つ。現状に関する視点（顧客満足度・リピート率など）→ 適切
【オ】財務の視点 → BSCの4つの視点の1つ。過去の結果に関する視点（売上高・経常利益など）→ 適切`,
    tableData: {
      caption: "■ BSCの4つの視点",
      headers: ["視点", "時間軸", "指標例"],
      rows: [
        ["財務の視点", "過去の経営結果", "売上高、経常利益"],
        ["顧客の視点", "現在の経営状況", "顧客満足度、リピート率"],
        ["業務プロセスの視点", "現在の経営状況", "原価率、不良品率"],
        ["学習と成長の視点", "将来の経営", "従業員満足度、研修費用、改善提案数"],
      ],
    },
  },
  {
    id: 2,
    title: "情報システムの投資評価",
    year: "平成24年 第23問",
    question:
      "ある中小製造企業は、顧客の要望に合わせて製品を設計・製造・販売している。近年、海外を含めて顧客からの受注が増加しており、受発注処理・顧客コミュニケーション・社内製造指示などのシステム化を検討している。聞き取り調査の結果、経営者や従業員はシステム開発の投資評価をはっきりさせておきたいと考えている。投資評価に関する記述として最も適切なものはどれか。",
    choices: [
      "本システムの構築には多様な案が考えられるが、それらを検討する場合に、システム開発のプロジェクト遂行に関するリスクと、システムによってもたらされるベネフィットとの2軸の視点から、それらの案を評価するポートフォリオ分析が有用である。",
      "本システムへの投資をTCOで評価する場合、従業員の教育などにかかわる技術サポートコスト、セキュリティ管理などにかかわる管理コスト、コンピュータの利用にかかわるエンドユーザコストの3つの視点から行う。",
      "本システムを評価する場合、顧客がどう評価するかが重要であり、顧客ならば提案されたシステムをいくらなら購入するかを算定してもらうリアルオプションプライシングと言われる手法を採用することが妥当である。",
      "本来、システム導入は合理化のためであり、従って、システム導入に際して従業員何人を減らすことができるかを算定できれば、本システムの投資価値は判断できる。",
    ],
    correctIndex: 0,
    explanation: `【ア】ポートフォリオ分析：「プロジェクト遂行リスク」と「ベネフィット」の2軸で各案を評価する手法。情報システム投資評価として有用。→ ★正解

【イ】TCO（Total Cost of Ownership）：全所有コストのことで、選択肢の3つに加え、ハードウェア・ソフトウェア費用やシステム開発費も含まれます。「3つの視点から行う」は不完全。→ 不適切

【ウ】リアルオプション：金融工学のオプション理論をプロジェクト投資評価に応用した手法。「顧客に購入金額を算出してもらう手法」ではありません。→ 不適切

【エ】人員削減だけで投資価値を判断：投資価値の算出方法はシステムの種類によって異なります。人員削減だけが投資価値ではありません。→ 不適切`,
  },
  {
    id: 3,
    title: "データレイク",
    year: "令和4年 第4問",
    question:
      "データを格納する考え方としてデータレイクが注目されている。データレイクに関する記述として、最も適切なものはどれか。",
    choices: [
      "組織内で運用される複数のリレーショナルデータベースからデータを集めて格納する。",
      "組織内の構造化されたデータや、IoT機器やSNSなどからの構造化されていないデータをそのままの形式で格納する。",
      "データウェアハウスから特定の用途に必要なデータを抽出し、キー・バリュー型の形式で格納する。",
      "データ利用や分析に適したスキーマをあらかじめ定義して、その形式にしたがってデータを格納する。",
      "テキスト形式のデータと画像・音声・動画などのバイナリ形式のデータをそれぞれ加工し、構造化したうえで格納する。",
    ],
    correctIndex: 1,
    explanation: `【ア】リレーショナルDBのみから収集 → リレーショナルDBは構造をあらかじめ定義・必要なデータのみ保存。データレイクとは異なる。→ 不適切

【イ】構造化・非構造化データをそのままの形式で格納 → データレイクの正確な説明。→ ★正解

【ウ】特定の用途に限定・KVS形式で格納 → データレイクは特定用途に限定せず様々な用途に対応。→ 不適切

【エ】スキーマ定義 → リレーショナルデータベースの特徴。→ 不適切

【オ】加工・構造化したうえで格納 → データレイクは加工せずそのまま保存するのが特徴。→ 不適切`,
    tableData: {
      caption: "■ データ管理の種類比較",
      headers: ["種類", "特徴", "用途"],
      rows: [
        ["データウェアハウス", "基幹系データを蓄積・整理。全社のデータ倉庫", "意思決定・経営分析"],
        ["データマート", "DWHからテーマ別に抽出したDB", "特定部門の情報ニーズ対応"],
        ["データレイク", "生データをそのまま保存。構造化・非構造化両対応", "ビッグデータ分析・AI学習"],
      ],
    },
  },
  {
    id: 4,
    title: "経営情報システム（用語）",
    year: "平成27年 第13問",
    question:
      "企業経営における情報技術の利用が進み、その重要性が増す中で、情報技術を利用するシステムやシステム化指針を省略語もしくはカタカナ語として言い表すことが多くなった。それらに関する記述として最も適切なものはどれか。",
    choices: [
      "PERT/CPMで用いられるクリティカルパス法と情報技術を組み合わせて、顧客と企業との間の業務フローの最適化を行うためのシステムをCRMと呼ぶ。",
      "企業を構成する様々な部門・業務で扱う資源を統一的・一元的に管理することを可能にするシステムをERPと呼ぶ。",
      "クラウドコンピューティングの多様なサービスが展開されているが、その中から最適なサービスを選択するシステム化指針をクラウドソーシングと呼ぶ。",
      "クラウドコンピューティングの利用に際して、社内にサーバを設置して情報の漏えいを防ぐシステム化指針をインソーシングと呼ぶ。",
    ],
    correctIndex: 1,
    explanation: `【ア】CRM（Customer Relationship Management）：顧客との関係を維持・構築する経営手法。PERT/CPMはプロジェクト日程計画手法であり、CRMの説明ではありません。→ 不適切

【イ】ERP（Enterprise Resource Planning）：企業の基幹業務を統合的に管理するパッケージ。人・モノ・金・情報を全体最適の視点から計画・管理。→ ★正解

【ウ】クラウドソーシング：不特定多数の人にアイデア提供や業務を委託すること。クラウドコンピューティングのサービス選択指針ではありません。→ 不適切

【エ】インソーシング：外部委託していた業務を自社で再び行うこと。クラウドを使いつつ社内サーバを設置する指針ではありません。→ 不適切`,
  },
  {
    id: 5,
    title: "ERP",
    year: "令和元年 第15問",
    question:
      "「ERP（Enterprise Resource Planning）システム」に関する記述として、最も適切なものはどれか。",
    choices: [
      "基幹業務プロセスの実行を、統合業務パッケージを利用して、必要な機能を相互に関係付けながら支援する総合情報システムである。",
      "基幹業務プロセスをクラウド上で処理する統合情報システムである。",
      "企業経営に必要な諸資源を統合的に管理するシステムである。",
      "企業経営の持つ諸資源の戦略的な活用を計画するためのシステムである。",
    ],
    correctIndex: 0,
    explanation: `ERP（Enterprise Resource Planning）は、会計・販売・生産・購買・物流・人事など企業の主要業務を1つのパッケージソフトで総合管理するシステムです。

【ア】統合業務パッケージを利用し、必要な機能を相互に関連付けながら支援する総合情報システム → ERPの特徴を正確に記述。→ ★正解

【イ】「必ずしもクラウド上で処理するものではない」→ 自社サーバ上でERPを稼働させているケースも多い。→ 不適切

【ウ】「諸資源を統合的に管理」→ 考え方として正しいが、「統合業務パッケージ」に言及したアがより適切。→ 不適切（消去法でアを選ぶ）

【エ】「戦略的な活用を計画」→ ERPは情報を総合管理するが、戦略的計画まではしない。→ 不適切`,
  },
  {
    id: 6,
    title: "OLAP",
    year: "令和5年 第16問",
    question:
      "OLAPは、ビジネスインテリジェンス（BI）に用いられる主要な技術の1つである。OLAPに関する記述として、最も適切なものはどれか。",
    choices: [
      "HOLAPとは、Hadoopと呼ばれる分散処理技術を用いたものをいう。",
      "MOLAPとは、多次元データを格納するのにリレーショナルデータベースを用いたものをいう。",
      "ROLAPとは、多数のトランザクションをリアルタイムに実行するものをいう。",
      "ダイシングとは、多次元データの分析軸を入れ替えて、データの切り口を変えることをいう。",
      "ドリルスルーとは、データ集計レベルを変更して異なる階層の集計値を参照することをいう。",
    ],
    correctIndex: 3,
    explanation: `OLAP（On-Line Analytical Processing）はデータウェアハウス等のデータをユーザが多角的に分析するためのツールです。

■ OLAPの分析機能
・ドリルダウン：データを掘り下げて詳細を見る（部門→課 の売上など）
・スライシング：多次元データをある断面で切る（4月→5月への変更など）
・ダイシング：表示される次元を入れ替える（商品×時間軸 を 顧客×時間軸に変更）

■ OLAPの種類
・MOLAP：データと集計結果の両方を分析サーバに格納し多次元的に解析
・ROLAP：データを分析サーバに、集計結果はリレーショナルDBに格納して解析
・HOLAP：データをその都度読込み、集計結果も分析サーバに格納して解析

【ア】HOLAPはHadoopとは無関係 → 不適切
【イ】MOLAPはリレーショナルDBではなく分析サーバに格納 → 不適切
【ウ】ROLAPはリアルタイムトランザクションではない → 不適切
【エ】ダイシング：多次元データの分析軸を入れ替えてデータの切り口を変える → ★正解
【オ】ドリルスルーは関連する別レポートを開く機能（集計レベル変更はドリルダウン）→ 不適切`,
  },
  {
    id: 7,
    title: "データ分析（空欄補充）",
    year: "令和3年 第8問",
    question:
      "以下の文章の空欄Ａ～Ｄに入る語句の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n意思決定や計画立案のために、組織内で運用される情報システムやデータベースなどからデータを集めて格納しておく場所を（Ａ）と呼ぶ。この（Ａ）から、必要なものだけを利用しやすい形式で格納したデータベースを（Ｂ）と呼ぶ。このような構造化されたデータに加えて、IoT機器やSNSなどからの構造化されていないデータを、そのままの形式で格納しておく（Ｃ）が利用されつつある。膨大なデータを蓄積する必要があるため、比較的安価なパブリッククラウドのオブジェクトストレージに格納される場合が多い。収集されたデータの品質を高めるためには、データ形式の標準化や（Ｄ）が重要である。",
    choices: [
      "Ａ：データウェアハウス　Ｂ：データマート　Ｃ：データレイク　Ｄ：データクレンジング",
      "Ａ：データウェアハウス　Ｂ：データレイク　Ｃ：データスワンプ　Ｄ：データクレンジング",
      "Ａ：データマート　Ｂ：データウェアハウス　Ｃ：データプール　Ｄ：データマイグレーション",
      "Ａ：データマート　Ｂ：リレーショナルデータベース　Ｃ：データレイク　Ｄ：データマイグレーション",
      "Ａ：データレイク　Ｂ：データマート　Ｃ：データプール　Ｄ：データマイニング",
    ],
    correctIndex: 0,
    explanation: `■ 各空欄の解答

Ａ：組織内の情報システム等からデータを集めて格納 → データウェアハウス（全社のデータ倉庫）

Ｂ：データウェアハウスから必要なものだけを利用しやすい形式で格納 → データマート（テーマ別・部門別のデータ集）

Ｃ：構造化・非構造化データをそのままの形式で格納（IoT・SNS等）→ データレイク

Ｄ：収集データの品質を高める処理 → データクレンジング（誤りの修正・不足データの補完・重複の除去）

■ データ管理の流れ
基幹システム → データウェアハウス → データマート（テーマ別）
IoT/SNS等 → データレイク（生データをそのまま保存）

以上より、Ａ：データウェアハウス、Ｂ：データマート、Ｃ：データレイク、Ｄ：データクレンジング → ★アが正解`,
  },
  {
    id: 8,
    title: "Webマーケティング（SEO）",
    year: "平成29年 第7問",
    question:
      "Webコンテンツを多くのネット利用者に閲覧してもらうためには、検索サイトの仕組みを理解して利用することが重要である。以下の文章の空欄Ａ〜Ｄに入る語句の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n検索サイトは、インターネット上にあるWebサイト内の情報を（Ａ）と呼ばれる仕組みで収集し、検索用のデータベースに登録する。検索サイトに対して利用者からあるキーワードで検索要求が出された場合、検索サイトは、独自の（Ｂ）によって求めた優先度をもとに、その上位から検索結果を表示している。Webサイト運営者は、Webコンテンツの内容が検索結果の上位に表示されるような施策を行う必要があり、（Ｃ）対策と呼ばれる。これにはブラックハット対策と（Ｄ）対策がある。",
    choices: [
      "Ａ：ガーベージ　　Ｂ：アルゴリズム　　Ｃ：SERP　　Ｄ：ホワイトハット",
      "Ａ：クローラ　　　Ｂ：アルゴリズム　　Ｃ：SEO　　　Ｄ：ホワイトハット",
      "Ａ：クローラ　　　Ｂ：ハッシュ　　　　Ｃ：KGI　　　Ｄ：ブルーハット",
      "Ａ：スパイダー　　Ｂ：メトリクス　　　Ｃ：SEM　　　Ｄ：グレーハット",
    ],
    correctIndex: 1,
    explanation: `SEO（Search Engine Optimization：検索エンジン最適化）は、自社のWebサイトを特定キーワードでGoogleなどの検索エンジン上位に表示させる取り組みです。

■ 各空欄の解答
Ａ：Webサイト情報を収集する仕組み → クローラ（スパイダー・ロボットとも呼ばれる）
Ｂ：検索結果の優先度を決める仕組み → アルゴリズム（各検索エンジン独自のもの）
Ｃ：検索結果の上位表示を目指す施策 → SEO（Search Engine Optimization）
Ｄ：ガイドラインに従ったSEO → ホワイトハット（違反のブラックハットSEOの対義語）

・ブラックハットSEO：ガイドライン無視で検索エンジンを騙す手法（ペナルティリスクあり）
・ホワイトハットSEO：ガイドラインに沿った正当な手法

■ 参考用語
・SERP：Search Engine Result Page（検索結果ページ）
・SEM：Search Engine Marketing（SEOとWeb広告の両方を含む）

以上より、★イが正解`,
  },
  {
    id: 9,
    title: "検索エンジンのフィルターバブル",
    year: "平成30年 第13問",
    question:
      "検索エンジンによる情報収集では、「フィルターバブル」と呼ばれる弊害も指摘されている。フィルターバブルに関する記述として、最も適切なものはどれか。",
    choices: [
      "虚偽の情報から作られたニュースがまん延することで、利用者の正しい判断を阻害することが懸念されている。",
      "検索結果の記事に広告を自然に溶け込ませて提示するために、利用者の情報収集が妨げられることが懸念されている。",
      "不自然な外部リンクを増やすなどして検索結果の表示順序を意図的に操作できるために、必要な情報にたどり着くことが困難になることが懸念されている。",
      "利用者の過去の検索履歴などに応じた情報を優先的に提示する傾向があるために、利用者の目に触れる情報に偏りの生じることが懸念されている。",
    ],
    correctIndex: 3,
    explanation: `フィルターバブルとは、検索エンジンの学習機能によって消費者の嗜好に合わせた情報ばかりが優先表示され、自分の好む情報しか存在しない「泡（バブル）」に包まれた状態になる現象です。

【ア】フェイクニュース（虚偽情報のまん延）に関する記述。→ 不適切

【イ】ネイティブ広告（記事に溶け込む広告）に関する記述。→ 不適切

【ウ】ブラックハットSEO（不自然な外部リンクによる順位操作）に関する記述。→ 不適切

【エ】過去の検索履歴に応じた情報を優先提示することで情報に偏りが生じる → フィルターバブルの正確な説明。→ ★正解`,
  },
  {
    id: 10,
    title: "クラウドサービスの活用",
    year: "平成25年 第16問",
    question:
      "クラウドサービスの活用に関する記述として最も適切なものはどれか。",
    choices: [
      "クラウドサービス事業者がSaaSを提供しているとき、それに必要なサーバを自社で持っていない場合がある。",
      "クラウドサービス事業者がパスワードリセット機能を提供している場合、ユーザ企業ではクラウドサービスのすべての利用者にその方法を伝えて、パスワードを自分で再設定できるようにしておくのがよい。",
      "クラウドサービス事業者がバックアップをアーカイブとして確保しているので、ユーザ企業側でバックアップする必要はない。",
      "クラウドサービスの稼働率がSLA（Service Level Agreement）で年99.9％以上と保証されていれば、不慮のサービス停止の場合でも1時間以内に稼働状態に復旧できる。",
    ],
    correctIndex: 0,
    explanation: `【ア】SaaS事業者自体が他のIaaSクラウドを利用することで、サーバを自社で持たないことも可能です。→ ★正解

【イ】パスワードリセット機能を全員が使えるようにするとセキュリティリスクが高まります。システム管理者だけが使える運用が望ましい。→ 不適切

【ウ】クラウド事業者でもデータ消失事故は起きています。ユーザ企業側でもバックアップを取る方が信頼性が高い。→ 不適切

【エ】SLA稼働率99.9%の年間停止時間の計算：
　8,760時間 × 0.001 = 8.76時間 ≒ 約9時間
　→ 1時間以内に復旧できない可能性があります。
　（99.99%の場合に停止時間が約1時間）→ 不適切`,
  },
  {
    id: 11,
    title: "クラウドサービスの活用2",
    year: "平成28年 第22問",
    question:
      "近年、クラウドサービスが台頭し、自社システムからクラウドサービスに移行する動きが活発になりつつある。クラウドサービスは中小事業者にとっても有益であるが、その利用のためには様々な課題について検討しなくてはならない。クラウドサービスやその利用に関する記述として最も適切なものはどれか。",
    choices: [
      "クラウドサービスにおいては、情報セキュリティの確保が重要になるが、独立行政法人情報処理推進機構ではクラウドサービスの安全利用に関する手引きを出している。",
      "クラウドサービスの利用料金の多くはサービス内容に応じて異なるが、使用したデータ容量では異ならないので、コストの視点から大企業の多くがクラウドサービスを利用し始めている。",
      "パブリッククラウドの形態には、SaaS、PaaS、IaaS、DaaSなどがあり、いずれもアプリケーション、ミドルウェア、OS、ハードウェアが一体化されたサービスとしてエンドユーザに提供される。",
      "オンプレミス型クラウドサービスとは自社でインフラを持たずクラウド事業者からサービスの提供を受ける形態をいい、ホステッド型クラウドサービスとは自社でインフラを持つ企業内クラウドの形態をいう。",
    ],
    correctIndex: 0,
    explanation: `【ア】独立行政法人情報処理推進機構（IPA）は「中小企業のためのクラウドサービス安全利用の手引き」を策定しています。→ ★正解

【イ】クラウドサービスの利用料金はサービス内容だけでなく、使用データ容量によっても異なるサービスが存在します。→ 不適切

【ウ】各サービス形態によって提供範囲は異なります：
・SaaS：ソフトウェアをサービスとして提供
・PaaS：OS・プラットフォームをサービスとして提供
・IaaS：サーバ等のインフラをサービスとして提供
・DaaS：デスクトップ環境をサービスとして提供
「全て一体化」ではありません。→ 不適切

【エ】説明が逆です。
・オンプレミス型：自社でインフラを構築・運用する形態
・ホステッド型：自社でインフラを持たずクラウド事業者からサービス提供を受ける形態 → 不適切`,
    tableData: {
      caption: "■ SaaS/PaaS/IaaSの提供範囲",
      headers: ["提供形態", "提供するもの", "ユーザが管理するもの"],
      rows: [
        ["SaaS", "アプリ～インフラすべて", "データのみ"],
        ["PaaS", "OS・ミドルウェア・インフラ", "アプリケーション、データ"],
        ["IaaS", "サーバ・ストレージ・ネットワーク", "OS、アプリ、データ"],
      ],
    },
  },
  {
    id: 12,
    title: "クラウドコンピューティング（用語）",
    year: "令和4年 第12問",
    question:
      "企業は環境変化に対応するために、コンピュータシステムの処理能力を弾力的に増減させたり、より処理能力の高いシステムに移行させたりする必要がある。以下の記述のうち、最も適切な組み合わせを下記の解答群から選べ。\n\nａ：システムを構成するサーバの台数を増やすことでシステム全体の処理能力を高めることを、スケールアウトという。\nｂ：システムを構成するサーバを高性能なものに取り替えることでシステム全体の処理能力を高めることを、スケールアップという。\nｃ：既存のハードウェアやソフトウェアを同等のシステム基盤へと移すことを、リファクタリングという。\nｄ：パッケージソフトウェアを新しいバージョンに移行する時などに行われ、データやファイルを別の形式に変換することを、リフト＆シフトという。\nｅ：情報システムをクラウドに移行する手法の1つで、既存のシステムをそのままクラウドに移し、漸進的にクラウド環境に最適化していく方法を、コンバージョンという。",
    choices: ["ａとｂ", "ａとｅ", "ｂとｃ", "ｃとｄ", "ｄとｅ"],
    correctIndex: 0,
    explanation: `■ 各用語の正しい定義
・スケールアウト：サーバ台数を増やしてシステム全体の処理能力を高めること
・スケールアップ：サーバを高性能なものに替えて処理能力を高めること
・リプレイス：既存のハードウェア・ソフトウェアを同等のシステム基盤へ移すこと
・コンバージョン：パッケージを新バージョンに移行する際にデータ・ファイルを別形式に変換すること
・リフト＆シフト：既存システムをそのままクラウドに移し、漸進的に最適化する方法
・リファクタリング：外部から見た挙動は変えずにプログラムの内部構造を変えること

■ 各記述の評価
ａ：スケールアウト → 正しい定義 ✓
ｂ：スケールアップ → 正しい定義 ✓
ｃ：「リファクタリング」は誤り → 正しくは「リプレイス」✗
ｄ：「リフト＆シフト」は誤り → 正しくは「コンバージョン」✗
ｅ：「コンバージョン」は誤り → 正しくは「リフト＆シフト」✗

以上より、正しいのはａとｂ → ★アが正解`,
  },
  {
    id: 13,
    title: "ビッグデータ",
    year: "平成25年 第15問",
    question:
      "通信技術の高度化と機器のインテリジェント化によって、企業の内外で多様で大量のデータが蓄積されるようになり、ビッグデータが注目されている。ビッグデータに関する記述として最も適切なものはどれか。",
    choices: [
      "ビッグデータ活用で発展が期待されている経済産業省の「IT融合新産業」とは、IT産業の構造変化によって創出される新ビジネスのことである。",
      "ビッグデータ活用の鍵となるC2Cは、インターネットで連結されたデータ通信の技術である。",
      "ビッグデータ活用の鍵となるM2Mは、人間と機械との間の自動データ連携の技術である。",
      "ビッグデータの活用では、業務取引上生成される構造化データだけでなく非構造化データも注目されている。",
    ],
    correctIndex: 3,
    explanation: `ビッグデータとは、従来のDBMS等では管理・分析が困難なほど巨大で多様な大量のデータ群のことです。

【ア】IT融合新産業：「IT産業だけでなく、製造業・サービス業・農業等の多様な産業がITを活用して構造変化を遂げて生まれる新ビジネス、および異分野の産業がITを媒介として結びついて生まれる新ビジネス」が含まれます。IT産業の構造変化だけではありません。→ 不適切

【イ】C2C（Consumer to Consumer）：ネットオークションなど一般消費者間の取引のこと。「データ通信の技術」ではありません。→ 不適切

【ウ】M2M（Machine to Machine）：機器同士のコミュニケーション（工場内の集中制御、自動販売機の遠隔監視など）。「人間と機械の間」ではなく「機械同士」のデータ連携です。→ 不適切

【エ】構造化データ（顧客情報・販売データ）だけでなく、非構造化データ（メール・画像・動画）も注目されています。→ ★正解`,
  },
  {
    id: 14,
    title: "ビッグデータ、ブロックチェーン",
    year: "平成30年 第14問",
    question:
      "ビッグデータの時代では、デジタルデータを介してヒトやモノを結ぶネットワークが急激に拡大していく現象が見られる。ネットワークに関する記述として、最も適切なものはどれか。\n\n（注）ノードとはネットワークの結節点、あるノードの次数とはそのノードと他のノードを結ぶ線の数を意味する。",
    choices: [
      "次数分布がべき乗則に従う、インターネットなどで見られるスケールフリー・ネットワークには、ハブと呼ばれる次数の大きなノードが存在する。",
      "ブロックチェーンとは、Web上に仮想的な金融機関を置き、金融取引の履歴をWeb上のデータベースに一元管理するネットワークをいう。",
      "メトカーフの法則は、デジタルデータの爆発的な増大を背景に、ノードの増加と共に価値が指数関数的に増えていく状況を表している。",
      "リンクポピュラリティは、ネットワーク分析で使う指標の1つで、あるノードを通る経路が多いほど大きくなる。",
    ],
    correctIndex: 0,
    explanation: `【ア】スケールフリー・ネットワーク：一部のノードのみが無数のリンクを集め、大多数はわずかなリンクしか持たないネットワーク形態。インターネットのウェブサイト群が代表例（一部の大規模人気サイトが膨大なリンクを集める）。ハブと呼ばれる次数の大きなノードが存在します。→ ★正解

【イ】ブロックチェーン：通貨取引等の台帳を中央集中管理せず、ネットワーク接続の全端末が台帳を所持する分散型データベース技術。「一元管理」ではありません。→ 不適切

【ウ】メトカーフの法則：ネットワークの価値はノード・利用者の数の「2乗に比例」する法則。「指数関数的」ではありません。→ 不適切

【エ】リンクポピュラリティ：外部サイトから自らのサイトに集まるリンクの質と量をもとに重要度・人気度を評価する考え方。「ノードを通る経路の数」ではありません。→ 不適切`,
  },
  {
    id: 15,
    title: "情報化社会の将来像",
    year: "令和5年 第15問",
    question:
      "情報化社会の将来像に関する考え方についての記述として、最も適切なものはどれか。",
    choices: [
      "「DX」とは、人件費削減を目的として、企業組織内のビジネスプロセスのデジタル化を進め、人間の仕事をAIやロボットに行わせることを指している。",
      "「Society5.0」とは、サイバー空間（仮想空間）とフィジカル空間（現実空間）を高度に融合させたシステムにより、経済発展と社会的課題の解決を両立させる人間中心の社会を指している。",
      "「Web3.0」とは、情報の送り手と受け手が固定されて送り手から受け手への一方的な流れであった状態が、送り手と受け手が流動化して誰でもWebを通じて情報を受発信できるようになった状態を指している。",
      "「インダストリー4.0」とは、ドイツ政府が提唱した構想であり、AIを活用して人間の頭脳をロボットの頭脳に代替させることを指している。",
      "「第三の波」とは、農業革命（第一の波）、産業革命（第二の波）に続いて、第三の波としてシンギュラリティが訪れるとする考え方を指している。",
    ],
    correctIndex: 1,
    explanation: `■ 各用語の正しい定義

DX：「企業がデータとデジタル技術を活用して、製品・サービス・ビジネスモデルを変革するとともに、業務・組織・プロセス・企業文化を変革し、競争上の優位性を確立すること」（経済産業省）。AI化・ロボット化だけではない。

Society5.0：サイバー空間とフィジカル空間を高度に融合させたシステムにより、経済発展と社会的課題解決を両立する人間中心の社会。狩猟(1.0)→農耕(2.0)→工業(3.0)→情報(4.0)→Society5.0

Web3.0：従来より安全で透明性が高く、中央集権化されていないWebを実現する技術（ブロックチェーン等を活用）。「送受信の双方向化」はWeb2.0の説明。

インダストリー4.0：ドイツが提唱。製造業の競争力強化のためのIoTによる工場革新（スマート工場）。AIではなくIoT活用。

第三の波（トフラー）：農業革命(第一の波)→産業革命(第二の波)→情報革命(第三の波)。シンギュラリティではない。

【ア】DXはAI化・ロボット化だけではない → 不正解
【イ】Society5.0の正確な定義 → ★正解
【ウ】Web2.0の説明 → 不正解
【エ】インダストリー4.0はIoT活用（AIではない）→ 不正解
【オ】第三の波はシンギュラリティではなく情報革命 → 不正解`,
  },
  {
    id: 16,
    title: "ブロックチェーン技術",
    year: "令和4年 第25問",
    question:
      "ブロックチェーン技術に関する記述として、最も適切なものはどれか。",
    choices: [
      "NFT（Non-Fungible Token）は、ブロックチェーン技術を基に作られた一意で代替不可能なトークンであり、デジタルコンテンツに対応したNFTを発行することにより唯一性・真正性を証明できる。",
      "PoW（Proof of Work）とは、ブロックチェーン上に新たなトランザクションを追加するための合意形成メカニズムの1つで、承認権限を持つ人のコンセンサスで決める。",
      "スマートコントラクトは、ブロックチェーン上に保存されたプログラムコードのことであり、暗号資産の取引に限定して利用される。",
      "ブロックチェーンネットワークでは、パブリック型、コンソーシアム型、プライベート型のいずれにおいても中央管理者を置くことはない。",
      "ブロックチェーンはブロック間のデータの連続性を保証する技術の1つであり、追加されたブロックが前のブロックのナンス値を保持することによって連続性が確保されている。",
    ],
    correctIndex: 0,
    explanation: `ブロックチェーンとは、通貨取引等の台帳を中央集中管理せず、ネットワーク接続の全端末が台帳を所持する分散型データベース技術。暗号技術を利用し、ビットコイン等の仮想通貨インフラに活用されています。

【ア】NFT（Non-Fungible Token：非代替性トークン）：ブロックチェーン技術を基に作られた一意で代替不可能なトークン。デジタルコンテンツのNFT発行により唯一性・真正性を証明できます。→ ★正解

【イ】PoW（Proof of Work）：暗号資産の取引データをブロックチェーンにつなぐための仕組み。「承認権限を持つ人のコンセンサス」ではなく、コンピュータの計算能力を競う仕組みです。→ 不適切

【ウ】スマートコントラクト：特定の条件が満たされた場合に決められた処理が自動実行される契約履行管理の自動化。暗号資産に限定されません。→ 不適切

【エ】コンソーシアム型・プライベート型には管理者が存在します。→ 不適切

【オ】ブロック間の連続性はナンス値ではなく「ハッシュ値」を保持することで確保されます。→ 不適切`,
  },
  {
    id: 17,
    title: "機械学習の手法",
    year: "令和4年 第15問",
    question:
      "機械学習の手法に関する記述として、最も適切な組み合わせを下記の解答群から選べ。\n\nａ：クラスタリングはカテゴリ型変数を予測する手法であり、教師あり学習に含まれる。\nｂ：クラスタリングはデータをグループに分ける手法であり、教師なし学習に含まれる。\nｃ：分類はカテゴリ型変数を予測する手法であり、教師あり学習に含まれる。\nｄ：分類はデータをグループに分ける手法であり、教師あり学習に含まれる。\nｅ：回帰はデータをグループに分ける手法であり、教師なし学習に含まれる。",
    choices: ["ａとｄ", "ａとｅ", "ｂとｃ", "ｂとｄ", "ｃとｅ"],
    correctIndex: 2,
    explanation: `■ 機械学習の主要手法

クラスタリング：データをグループに分ける手法 → 教師なし学習の代表的アルゴリズム（正解ラベルなしで自動分類）

分類（Classification）：カテゴリ型変数（離散値：犬/猫、男/女等）を予測 → 教師あり学習の代表的アルゴリズム

回帰（Regression）：数値（連続値：売上・株価等）を予測 → 教師あり学習の代表的アルゴリズム

■ 各記述の評価
ａ：クラスタリングは「教師なし学習」→ 誤り ✗
ｂ：クラスタリングはデータをグループに分ける・教師なし学習 → 正しい ✓
ｃ：分類はカテゴリ型変数を予測・教師あり学習 → 正しい ✓
ｄ：分類は「データをグループに分ける手法」ではない → 誤り ✗
ｅ：回帰は教師「あり」学習 → 誤り ✗

以上より、ｂとｃが正しい → ★ウが正解`,
    tableData: {
      caption: "■ 機械学習の種類",
      headers: ["手法", "目的", "学習の種類"],
      rows: [
        ["クラスタリング", "データをグループに分ける", "教師なし学習"],
        ["分類", "カテゴリ型変数（離散値）を予測", "教師あり学習"],
        ["回帰", "数値（連続値）を予測", "教師あり学習"],
      ],
    },
  },
  {
    id: 18,
    title: "インターネット上での情報流通の特徴",
    year: "令和5年 第25問",
    question:
      "インターネット上での情報流通の特徴に関する以下の文章の空欄Ａ～Ｄに入る用語の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n人間は集団になると、個人でいるときよりも極端な方向に走りやすくなるという心理的傾向は（Ａ）と呼ばれている。キャス・サンスティーンは、インターネットでも（Ａ）を引き起こしやすくなる（Ｂ）という現象が見られると指摘した。こうした人間の心理的傾向とネットメディアの特性の相互作用による現象に、次のようなものが挙げられる。1つは、SNSなどを利用する際、人間は自分と似た興味や関心を持つユーザをフォローする傾向があるので、自分と似た意見が返ってくる（Ｃ）と呼ばれる現象である。もう1つは、アルゴリズムが利用者の検索履歴などを学習することで利用者にとって好ましい情報が表示されるようになり、その結果、利用者が見たい情報しか見えなくなるという（Ｄ）と呼ばれる現象である。",
    choices: [
      "Ａ：集団極性化　　Ｂ：サイバーカスケード　Ｃ：エコーチェンバー　Ｄ：フィルターバブル",
      "Ａ：集団極性化　　Ｂ：サイバーカスケード　Ｃ：バックファイア効果　Ｄ：エゴサーチ",
      "Ａ：ハロー効果　　Ｂ：サイバーカスケード　Ｃ：バックファイア効果　Ｄ：エゴサーチ",
      "Ａ：ハロー効果　　Ｂ：ナッジ　　　　　　　Ｃ：エコーチェンバー　　Ｄ：フィルターバブル",
      "Ａ：ハロー効果　　Ｂ：ナッジ　　　　　　　Ｃ：バックファイア効果　Ｄ：フィルターバブル",
    ],
    correctIndex: 0,
    explanation: `■ 各用語の定義

集団極性化：集団で意思決定する際、個人の場合より極端な意見になりやすい心理的傾向

サイバーカスケード：インターネット上のある意見に人々が流されて大きな流れとなること（滝＝カスケードの比喩）

エコーチェンバー：SNSで似た意見のユーザをフォローした結果、自分と似た意見が返ってくる現象（閉じた小部屋で音が反響する物理現象の比喩）

フィルターバブル：アルゴリズムが検索・クリック履歴を学習し、見たい情報ばかりが表示され、自身の考えの「バブル」に孤立する情報環境

■ 参考用語
・バックファイア効果：信じたくない証拠に遭遇すると当初の信念をより強めてしまう現象
・エゴサーチ：検索エンジンで自分自身を検索する行為
・ナッジ：行動経済学の理論で、特定の行動を微妙に誘導すること

以上より、Ａ：集団極性化、Ｂ：サイバーカスケード、Ｃ：エコーチェンバー、Ｄ：フィルターバブル → ★アが正解`,
  },
  {
    id: 19,
    title: "ソーシャルメディア",
    year: "平成25年 第14問",
    question:
      "SNSなどの発達によってソーシャルメディアは、個人間の私的な情報交換に利用されるだけでなく、ビジネスでも多様に利用されつつある。ソーシャルメディアを利用する上での要点や対処法に関する記述として最も適切なものはどれか。",
    choices: [
      "個人が開設したブログに社内で起こった出来事を書いたが、社外秘の情報が含まれていたので不適切だと分かった。翌日に削除すれば問題はない。",
      "自分の店舗に来た人の名前を、当人の了解を得ずソーシャルメディアに投稿して広告として利用しても、店舗は公共の場所なので問題はない。",
      "ソーシャルメディアに投稿したすべての内容は、一定期間保存された後、新規投稿内容で上書きされるので、何を投稿してもよい。",
      "自らがソーシャルメディアを使わなくても、ソーシャルメディアの炎上に巻き込まれることがある。",
    ],
    correctIndex: 3,
    explanation: `ソーシャルメディア：インターネット上でユーザ同士がコミュニケーションすることで成り立つメディア。種類：電子掲示板、ブログ、動画共有サイト、SNSなど。

【ア】「翌日に削除すれば問題なし」→ 不適切
→ ブログに書いた情報を見た第三者が他のSNSに転記するなどして短期間で拡散する可能性があります。翌日に削除しても第三者が書いた内容は削除できません。

【イ】「公共の場所なので問題なし」→ 不適切
→ 当人の了解を得ずに名前を投稿することはプライバシーの侵害にあたる可能性があります。訴訟問題に発展する危険性もあります。

【ウ】「上書きされるので何でも投稿可」→ 不適切
→ 投稿内容が消滅するかはサービスによって異なります。また消滅するとしても、それまでに拡散している可能性があります。

【エ】「自らが使わなくても炎上に巻き込まれることがある」→ ★正解
→ ソーシャルメディアの「炎上」は悪意を持った第三者の書き込み等によっても起こりえます。自らがソーシャルメディアを使っていなくても巻き込まれる可能性があります。`,
  },
  {
    id: 20,
    title: "スマートフォン、その他",
    year: "平成25年 第3問",
    question:
      "スマートフォン、パソコン、メインフレームなど多様な情報機器を有効に連携させてビジネスに利用するケースが増えてきた。それらの機器や連携に関する記述として最も適切なものはどれか。",
    choices: [
      "スマートフォンで作ったテキストデータはメインフレームでは利用できない。",
      "スマートフォンのアプリケーションは、パソコンでも作ることが可能である。",
      "スマートフォンはOSを利用しない。",
      "パソコン用のアプリケーションはメインフレームに対して上位互換になっているので、メインフレームでも使うことができる。",
    ],
    correctIndex: 1,
    explanation: `【ア】「テキストデータはメインフレームで利用不可」→ 不適切
→ テキストデータについて、文字コードがメインフレームでも対応していれば利用可能な場合があります。「利用できない」と断言するのは誤りです。

【イ】「スマートフォンのアプリはパソコンで開発可能」→ ★正解
→ スマートフォンのアプリケーションは一般的にパソコン上で開発され、GoogleやAppleのアプリ配信サイトを経由してユーザに提供されます。

【ウ】「スマートフォンはOSを利用しない」→ 不適切
→ スマートフォンはパソコンと同じくコンピュータの一種で、CPU・OS・アプリ等が搭載されています。代表的なOSはAndroid（Google）とiOS（Apple）。

【エ】「パソコン用アプリはメインフレームでも使用可能」→ 不適切
→ パソコンとメインフレームはOSが異なり、アプリには互換性がないのが一般的。またパソコンがメインフレームの「上位」とは言えません。`,
  },
  {
    id: 21,
    title: "BYOD",
    year: "平成26年 第19問",
    question:
      "携帯端末の普及に伴い、個人所有の端末を社内に持ち込み仕事に利用するBYODが注目を集めている。特に、IT投資の削減や情報共有の効率化が図られることなどから、BYODに対する期待は大きい。BYODに関する記述として最も適切なものはどれか。",
    choices: [
      "BYODを導入するとともに、自社サーバの機能をクラウドサービスに移行すれば、BCP対策の一環となる。",
      "MDMとは、持ち込まれる端末のデータべース管理システムを統一することを指す。",
      "シャドーITとは、会社所有の情報機器と同じハード、ソフトからなる端末に限定して持ち込みを許可することを指す。",
      "端末を紛失した場合などに対処するため、遠隔操作でデータを消去するローカルワイプと呼ばれる機能がある。",
    ],
    correctIndex: 0,
    explanation: `BYOD（Bring Your Own Device）：従業員が保有するスマートフォン・タブレット等を社内に持ち込んで業務に利用する形態。
・メリット：業務効率化（外出先からの社内データ利用等）
・デメリット：情報漏えい等のセキュリティリスク

【ア】BYOD＋クラウド移行でBCP対策 → ★正解
BCP（Business Continuity Plan：事業継続計画）。BYODにより自宅等でも業務継続が可能になり、クラウドでサーバの安全性も向上します。

【イ】MDMの説明が誤り → 不適切
MDM（Mobile Device Management）：モバイル端末のシステム設定を統合管理する手法（セキュリティ設定・ソフト管理・機能制限・遠隔データ消去等）。「データベース管理システムの統一」ではありません。

【ウ】シャドーITの説明が誤り → 不適切
シャドーIT：企業の承認なく従業員が勝手に持ち込み利用するシステム・ソフト。情報漏えい・ウイルス感染等のリスクがあります。

【エ】ローカルワイプの説明が誤り → 不適切
ローカルワイプ：認証失敗を一定回数繰り返した場合に自動で端末を初期化・データ消去する機能（「遠隔操作」ではない）。遠隔操作でのデータ消去は「リモートワイプ」と言います。`,
  },
  {
    id: 22,
    title: "統計分析の手法",
    year: "令和2年 第24問",
    question:
      "以下のａ～ｄは、分析したい状況に関する記述である。それぞれの状況において、どのような分析手法が適切か。最も適切なものの組み合わせを下記の解答群から選べ。\n\nａ：ある企業には3つの事業部がある。事業部ごとの売上高利益率の日次データが与えられている。この3つの事業部で売上高利益率に差異が見られるのかを検討したい。\n\nｂ：ある商品の売上高の日次データと、その商品の売上高に関係があると想定されるいくつかの変数のデータがある。どの変数が売上高にどの程度寄与しているのかを検討したい。\n\nｃ：数千人の顧客について、属性データ（男女・所得・購入履歴など）や趣味・嗜好に関するデータがある。顧客の特性にあったマーケティング活動をしたいので、顧客を分類したい。\n\nｄ：Webサイトの候補として2つのパターンがある。どちらのパターンを採用するかを決めたい。",
    choices: [
      "ａ：判別分析　ｂ：回帰分析　ｃ：コンジョイント分析　ｄ：A/B分析",
      "ａ：判別分析　ｂ：相関分析　ｃ：コンジョイント分析　ｄ：アクセス分析",
      "ａ：分散分析　ｂ：回帰分析　ｃ：クラスター分析　　　ｄ：A/B分析",
      "ａ：分散分析　ｂ：相関分析　ｃ：クラスター分析　　　ｄ：アクセス分析",
    ],
    correctIndex: 2,
    explanation: `■ 各分析手法の定義
・判別分析：対象がどのグループに属するかを判別する手法
・分散分析：3つ以上の集団における平均の差異を分析する手法
・回帰分析：要因数値と結果数値の関係性を明らかにする手法（単回帰・重回帰）
・相関分析：2つの要素の関連の強さを分析・数値化する手法
・コンジョイント分析：商品の複数特徴のうち、どの組み合わせが顧客評価を高めるかを分析（マーケティング用）
・クラスター分析：様々な特徴を持つ要素が混在する集団から類似要素をグループに分ける手法
・A/B分析：複数案をランダム表示し、ユーザのレスポンスが良い案を分析する手法
・アクセス分析：Webページ訪問ユーザの行動（流入元・閲覧・滞在時間等）を分析する手法

■ 各記述の適切な手法
ａ：3つ以上の集団の平均（利益率）の差異を分析 → 分散分析 ✓
ｂ：売上高と複数変数の関係・寄与度を分析 → 回帰分析（重回帰分析）✓
ｃ：様々な属性の顧客を分類 → クラスター分析 ✓
ｄ：2パターンのWebサイトから最適を選択 → A/B分析 ✓

以上より → ★ウが正解`,
    tableData: {
      caption: "■ 統計分析手法の整理",
      headers: ["手法", "用途"],
      rows: [
        ["分散分析", "3つ以上の集団間の平均差異の検定"],
        ["回帰分析", "複数要因が結果にどの程度寄与するかを分析"],
        ["クラスター分析", "類似する要素をグループに分類"],
        ["A/B分析", "複数のWebデザイン案の効果を比較"],
      ],
    },
  },
  {
    id: 23,
    title: "ISMS",
    year: "平成25年 第23問",
    question:
      "組織の情報セキュリティ基準として、「情報セキュリティマネジメントシステム（ISMS）適合性評価制度」が広く使われている。これに関する記述として最も適切なものはどれか。",
    choices: [
      "JIS Q 20000-1適合性に関する制度である。",
      "適合性の認証制度は、「認証機関」、「要員認証機関」、「認定機関」からなる仕組みである。",
      "適合性の認証登録後は、10年ごとに再認証審査を行う。",
      "標準として決められたセキュリティレベルでのシステム運用を求める。",
    ],
    correctIndex: 1,
    explanation: `ISMS（Information Security Management System）：組織が情報を適切に管理しセキュリティを守るためのマネジメントシステム。セキュリティポリシーを定め、情報資産とリスクを管理。一般社団法人情報マネジメントシステム認定センター（ISMS-AC）が運用。

【ア】ISMS適合性評価制度はJIS Q 27001（ISO 27001の日本工業規格化）に適合しているか審査します。JIS Q 20000-1はITサービスマネジメントの規格です。→ 不適切

【イ】ISMS適合性評価制度の仕組み：
・認証機関：組織のISMSがJIS Q 27001に適合しているか審査し登録する機関
・要員認証機関：審査員の資格を付与する機関
・認定機関：各機関がその業務を行う能力を備えているかをみる機関（JIPDEC）
→ ★正解

【ウ】認証登録後は「3年ごと」に再認証審査が行われます。10年ではありません。→ 不適切

【エ】ISMSは「組織が自らのリスクアセスメントにより必要なセキュリティレベルを決め、プランを持ち、資源配分してシステムを運用すること」を求めます。「標準として決められたレベル」ではなく組織が自ら決定します。→ 不適切`,
  },
  {
    id: 24,
    title: "標準化推進組織",
    year: "令和元年 第25問",
    question:
      "情報通信技術（ICT）においては、相互接続性や相互運用性を確保することが不可欠である。このため、さまざまな組織が規格の標準化を進めている。標準化を進める組織に関する以下の文章の空欄Ａ～Ｄに入る語句の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n（Ａ）は、世界160カ国以上の国家規格団体が加盟する世界的規模の非政府組織であり、世界的な標準化およびその関連活動の発展開発を図ることを目的としている。\n（Ｂ）は、国際連合の専門機関であり、情報通信分野の国際標準の策定を図り、発展途上国への技術協力の推進を行っている。\n（Ｃ）は、LANやイーサネットなどの通信方式や電子部品の研究や標準化を行う学会である。\n（Ｄ）は、インターネットのWebに関する技術の標準化を進める非営利団体である。\n（Ａ）や（Ｂ）のような国際標準化機関が作成する標準をデジュール標準と呼び、（Ｃ）や（Ｄ）のような民間団体が作成する標準をデファクト標準と呼ぶ。",
    choices: [
      "Ａ：IEEE　　Ｂ：ITU　　Ｃ：ISO　　Ｄ：W3C",
      "Ａ：ISO　　Ｂ：ITU　　Ｃ：IEEE　　Ｄ：W3C",
      "Ａ：ISO　　Ｂ：W3C　　Ｃ：IEEE　　Ｄ：ITU",
      "Ａ：ITU　　Ｂ：ISO　　Ｃ：W3C　　Ｄ：IEEE",
    ],
    correctIndex: 1,
    explanation: `■ 主要な標準化推進組織

ISO（International Organization for Standardization：国際標準化機構）
→ 世界160カ国以上の国家規格団体が加盟する非政府組織。世界的な標準化を推進。日本はJISC（日本産業標準調査会）が参加。【デジュール標準】

ITU（International Telecommunication Union：国際電気通信連合）
→ 国際連合の専門機関。情報通信分野の国際標準策定・電波の国際配分・発展途上国への技術協力を担う。【デジュール標準】

IEEE（Institute of Electrical and Electronic Engineers：米国電気電子学会）
→ LANやイーサネットなどの通信方式や電子部品の研究・標準化を行う学会。【デファクト標準】

W3C（World Wide Web Consortium）
→ インターネットのWebに関する技術の標準化を進める非営利団体。策定した仕様は「W3C勧告」と呼ばれる。【デファクト標準】

以上より、Ａ：ISO、Ｂ：ITU、Ｃ：IEEE、Ｄ：W3C → ★イが正解`,
    tableData: {
      caption: "■ 標準化推進組織一覧",
      headers: ["組織名", "種別", "主な役割"],
      rows: [
        ["ISO", "デジュール標準", "世界的な標準化（電気・通信・電子技術分野以外）"],
        ["ITU", "デジュール標準", "情報通信分野の国際標準・電波配分"],
        ["IEEE", "デファクト標準", "LANやイーサネット等の通信方式・電子部品"],
        ["W3C", "デファクト標準", "インターネットWebに関する技術の標準化"],
      ],
    },
  },
];

// ============================================================
// Firestore ヘルパー関数
// ============================================================
const getUserDoc = (passphrase) => {
  if (!db) return null;
  return doc(db, APP_ID, passphrase);
};

const loadUserData = async (passphrase) => {
  console.log("[DB] データ読み込み開始:", passphrase);
  try {
    if (!db) throw new Error("Firebase未初期化");
    const ref = getUserDoc(passphrase);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      console.log("[DB] データ読み込み完了:", data);
      return {
        results: data.results || {},
        reviewFlags: data.reviewFlags || [],
        progressIndex: data.progressIndex ?? null,
        progressMode: data.progressMode ?? null,
      };
    } else {
      console.log("[DB] 新規ユーザー");
      return { results: {}, reviewFlags: [], progressIndex: null, progressMode: null };
    }
  } catch (e) {
    console.error("[DB] 読み込みエラー:", e);
    return { results: {}, reviewFlags: [], progressIndex: null, progressMode: null };
  }
};

const saveUserData = async (passphrase, data) => {
  console.log("[DB] データ保存:", data);
  try {
    if (!db) throw new Error("Firebase未初期化");
    const ref = getUserDoc(passphrase);
    await setDoc(ref, data, { merge: true });
    console.log("[DB] 保存完了");
  } catch (e) {
    console.error("[DB] 保存エラー:", e);
  }
};

// ============================================================
// メインApp
// ============================================================
export default function App() {
  const [screen, setScreen] = useState("login");
  const [passphrase, setPassphrase] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ results: {}, reviewFlags: [], progressIndex: null, progressMode: null });
  const [selectedMode, setSelectedMode] = useState("all");
  const [questionList, setQuestionList] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [resumeInfo, setResumeInfo] = useState(null);
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0 });
  const [firebaseReady, setFirebaseReady] = useState(!!db);

  // ── ログイン処理 ──
  const handleLogin = async () => {
    const key = inputVal.trim();
    if (!key) return;
    setLoading(true);
    const data = await loadUserData(key);
    setPassphrase(key);
    setUserData(data);
    // 前回の進捗があれば案内
    if (data.progressIndex !== null && data.progressIndex > 0) {
      setResumeInfo({ progressIndex: data.progressIndex, progressMode: data.progressMode || "all" });
    }
    setLoading(false);
    setScreen("start");
    console.log("[App] ログイン完了, 進捗:", data.progressIndex, data.progressMode);
  };

  // ── 問題リスト構築 ──
  const buildList = (mode, data) => {
    const ud = data || userData;
    if (mode === "wrong") {
      return QUESTIONS.filter((q) => {
        const r = ud.results[q.id];
        return r && r.lastCorrect === false;
      });
    }
    if (mode === "review") {
      return QUESTIONS.filter((q) => (ud.reviewFlags || []).includes(q.id));
    }
    return [...QUESTIONS];
  };

  // ── クイズ開始 ──
  const handleStart = async (mode, startIndex = 0) => {
    const list = buildList(mode);
    if (list.length === 0) {
      alert(
        mode === "wrong"
          ? "前回不正解の問題がありません。"
          : mode === "review"
          ? "要復習の問題がありません。"
          : "問題がありません。"
      );
      return;
    }
    setSelectedMode(mode);
    setQuestionList(list);
    setCurrentIdx(startIndex);
    setSelectedAnswer(null);
    setSessionStats({ correct: 0, wrong: 0 });
    // 開始時にモードを保存
    const newData = { ...userData, progressMode: mode, progressIndex: startIndex };
    setUserData(newData);
    await saveUserData(passphrase, { progressMode: mode, progressIndex: startIndex });
    setScreen("quiz");
    console.log("[App] クイズ開始:", mode, "startIndex:", startIndex, "問題数:", list.length);
  };

  // ── 再開 ──
  const handleResume = async () => {
    if (!resumeInfo) return;
    const { progressMode, progressIndex } = resumeInfo;
    setResumeInfo(null);
    const list = buildList(progressMode);
    const safeIdx = Math.min(progressIndex, list.length - 1);
    await handleStart(progressMode, safeIdx);
  };

  // ── 最初から ──
  const handleRestart = async () => {
    setResumeInfo(null);
    const newData = { ...userData, progressIndex: 0, progressMode: "all" };
    setUserData(newData);
    await saveUserData(passphrase, { progressIndex: 0, progressMode: "all" });
  };

  // ── 解答選択 ──
  const handleAnswer = async (choiceIndex) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(choiceIndex);
    const q = questionList[currentIdx];
    const isCorrect = choiceIndex === q.correctIndex;
    console.log("[App] 解答:", LABELS[choiceIndex], "正解:", LABELS[q.correctIndex], isCorrect ? "○" : "×");

    // 正誤履歴を更新
    const prevResult = userData.results[q.id] || { correct: 0, wrong: 0 };
    const newResult = {
      correct: isCorrect ? prevResult.correct + 1 : prevResult.correct,
      wrong: isCorrect ? prevResult.wrong : prevResult.wrong + 1,
      lastCorrect: isCorrect,
    };
    const newResults = { ...userData.results, [q.id]: newResult };
    const newUserData = { ...userData, results: newResults, progressIndex: currentIdx };
    setUserData(newUserData);
    setSessionStats((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      wrong: s.wrong + (isCorrect ? 0 : 1),
    }));

    // Firestoreに保存
    await saveUserData(passphrase, {
      results: newResults,
      progressIndex: currentIdx,
      progressMode: selectedMode,
    });
  };

  // ── 次の問題へ ──
  const handleNext = async () => {
    if (currentIdx + 1 >= questionList.length) {
      // 完走 → progressIndexをリセット
      const newUserData = { ...userData, progressIndex: 0, progressMode: null };
      setUserData(newUserData);
      await saveUserData(passphrase, { progressIndex: 0, progressMode: null });
      setScreen("complete");
      console.log("[App] 全問完走。progressIndexをリセット");
      return;
    }
    setSelectedAnswer(null);
    setCurrentIdx((i) => i + 1);
    // 途中進捗を保存
    await saveUserData(passphrase, { progressIndex: currentIdx + 1, progressMode: selectedMode });
    console.log("[App] 次の問題へ:", currentIdx + 1);
  };

  // ── 要復習トグル ──
  const handleToggleReview = async () => {
    const q = questionList[currentIdx];
    const flags = userData.reviewFlags || [];
    const newFlags = flags.includes(q.id)
      ? flags.filter((id) => id !== q.id)
      : [...flags, q.id];
    const newUserData = { ...userData, reviewFlags: newFlags };
    setUserData(newUserData);
    await saveUserData(passphrase, { reviewFlags: newFlags });
    console.log("[App] 要復習トグル:", q.id, newFlags.includes(q.id) ? "追加" : "削除");
  };

  // ── ホームへ（進捗保存） ──
  const handleGoHome = async () => {
    if (screen === "quiz" && selectedAnswer === null) {
      // 未解答でホームへ → 現在のindexを保存
      await saveUserData(passphrase, { progressIndex: currentIdx, progressMode: selectedMode });
    }
    setSelectedAnswer(null);
    setScreen("start");
  };

  // ============================================================
  // レンダリング
  // ============================================================

  // ローディング
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-slate-600 text-lg">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  // ログイン画面
  if (screen === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">📚</div>
            <h1 className="text-2xl font-bold text-slate-800">過去問セレクト演習</h1>
            <p className="text-slate-500 mt-1 text-sm">4-5 経営と情報システム</p>
          </div>

          {!firebaseReady && (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 mb-4 flex gap-2">
              <AlertCircle className="text-amber-500 w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-amber-700 text-sm">
                Firebase未設定のため、学習履歴はこのセッション中のみ保持されます。
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              合言葉（ユーザーID）を入力
            </label>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="例: tanaka-study-2024"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-400 mt-1">
              ※ PCとスマホで同じ合言葉を入力すると学習履歴が同期されます
            </p>
          </div>

          <button
            onClick={handleLogin}
            disabled={!inputVal.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-lg transition-colors"
          >
            始める
          </button>
        </div>
      </div>
    );
  }

  // スタート（モード選択）画面
  if (screen === "start") {
    const wrongCount = QUESTIONS.filter((q) => {
      const r = userData.results[q.id];
      return r && r.lastCorrect === false;
    }).length;
    const reviewCount = (userData.reviewFlags || []).length;

    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-slate-800">📚 経営と情報システム</h1>
            <p className="text-xs text-slate-400">合言葉: {passphrase}</p>
          </div>
          <button
            onClick={() => setScreen("history")}
            className="flex items-center gap-1 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg"
          >
            <List className="w-4 h-4" />
            履歴
          </button>
        </header>

        <div className="max-w-lg mx-auto p-4">
          {/* 再開案内 */}
          {resumeInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
              <p className="text-blue-800 font-medium mb-1">
                📍 前回は【問題 {resumeInfo.progressIndex + 1}】まで進んでいます
              </p>
              <p className="text-blue-600 text-sm mb-3">
                モード：{resumeInfo.progressMode === "all" ? "すべての問題" : resumeInfo.progressMode === "wrong" ? "前回不正解のみ" : "要復習のみ"}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleResume}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium text-sm"
                >
                  続きから再開する
                </button>
                <button
                  onClick={handleRestart}
                  className="flex-1 bg-white border border-blue-300 text-blue-600 py-2 rounded-lg text-sm"
                >
                  最初から始める
                </button>
              </div>
            </div>
          )}

          {/* 統計 */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-5">
            <h2 className="text-sm font-bold text-slate-500 mb-3">📊 学習状況</h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-2xl font-bold text-slate-800">{QUESTIONS.length}</div>
                <div className="text-xs text-slate-400">全問題数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">{wrongCount}</div>
                <div className="text-xs text-slate-400">前回不正解</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">{reviewCount}</div>
                <div className="text-xs text-slate-400">要復習</div>
              </div>
            </div>
          </div>

          {/* モード選択 */}
          <h2 className="text-sm font-bold text-slate-600 mb-3">出題モードを選択</h2>
          <div className="space-y-3">
            <button
              onClick={() => handleStart("all")}
              className="w-full bg-white hover:bg-blue-50 border border-slate-200 rounded-xl p-4 text-left flex items-center justify-between group transition-colors"
            >
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  すべての問題
                </div>
                <div className="text-sm text-slate-400 mt-0.5">{QUESTIONS.length}問 出題</div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
            </button>

            <button
              onClick={() => handleStart("wrong")}
              disabled={wrongCount === 0}
              className="w-full bg-white hover:bg-red-50 border border-slate-200 disabled:opacity-40 rounded-xl p-4 text-left flex items-center justify-between group transition-colors"
            >
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <X className="w-5 h-5 text-red-500" />
                  前回不正解の問題のみ
                </div>
                <div className="text-sm text-slate-400 mt-0.5">{wrongCount}問 出題</div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-red-500" />
            </button>

            <button
              onClick={() => handleStart("review")}
              disabled={reviewCount === 0}
              className="w-full bg-white hover:bg-yellow-50 border border-slate-200 disabled:opacity-40 rounded-xl p-4 text-left flex items-center justify-between group transition-colors"
            >
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  要復習の問題のみ
                </div>
                <div className="text-sm text-slate-400 mt-0.5">{reviewCount}問 出題</div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-yellow-500" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // クイズ画面
  if (screen === "quiz") {
    const q = questionList[currentIdx];
    if (!q) return null;
    const isReview = (userData.reviewFlags || []).includes(q.id);
    const answered = selectedAnswer !== null;
    const isCorrect = answered && selectedAnswer === q.correctIndex;

    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow-sm px-4 py-3 flex items-center gap-3">
          <button onClick={handleGoHome} className="text-slate-500 hover:text-slate-800">
            <Home className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">
                {currentIdx + 1} / {questionList.length}
              </span>
              <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${((currentIdx + 1) / questionList.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleToggleReview}
            className={`p-1.5 rounded-lg ${isReview ? "bg-yellow-100 text-yellow-500" : "text-slate-300"}`}
          >
            <Star className={`w-5 h-5 ${isReview ? "fill-yellow-400" : ""}`} />
          </button>
        </header>

        <div className="max-w-2xl mx-auto p-4">
          {/* 問題ヘッダー */}
          <div className="bg-blue-600 text-white rounded-t-xl px-4 py-2 flex items-center gap-2">
            <span className="text-sm font-bold">問題 {q.id}</span>
            <span className="text-blue-200 text-xs">|</span>
            <span className="text-blue-100 text-xs">{q.year}</span>
            <span className="ml-auto text-xs bg-blue-500 px-2 py-0.5 rounded">{q.title}</span>
          </div>

          {/* 問題文 */}
          <div className="bg-white rounded-b-xl shadow-sm px-4 py-4 mb-4">
            <p className="text-slate-800 leading-relaxed whitespace-pre-line text-sm">{q.question}</p>
          </div>

          {/* 選択肢 */}
          <div className="space-y-2 mb-4">
            {q.choices.map((choice, i) => {
              let style = "bg-white border border-slate-200 text-slate-700 hover:border-blue-400";
              if (answered) {
                if (i === q.correctIndex) {
                  style = "bg-green-50 border-2 border-green-500 text-green-800";
                } else if (i === selectedAnswer && !isCorrect) {
                  style = "bg-red-50 border-2 border-red-400 text-red-700";
                } else {
                  style = "bg-slate-50 border border-slate-200 text-slate-400";
                }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={answered}
                  className={`w-full rounded-xl px-4 py-3 text-left flex gap-3 items-start transition-colors ${style}`}
                >
                  <span className="font-bold text-sm flex-shrink-0 mt-0.5">{LABELS[i]}</span>
                  <span className="text-sm leading-relaxed">{choice}</span>
                  {answered && i === q.correctIndex && (
                    <Check className="ml-auto w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                  {answered && i === selectedAnswer && !isCorrect && (
                    <X className="ml-auto w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* 解説（解答後に表示） */}
          {answered && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
              {/* 正誤バナー */}
              <div
                className={`px-4 py-3 font-bold flex items-center gap-2 ${
                  isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                {isCorrect ? "正解！" : `不正解　正解は【${LABELS[q.correctIndex]}】`}
              </div>

              {/* 要復習チェック */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm text-slate-600">要復習フラグ</span>
                <button
                  onClick={handleToggleReview}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isReview
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
                >
                  <Star className={`w-4 h-4 ${isReview ? "fill-yellow-400 text-yellow-500" : ""}`} />
                  {isReview ? "要復習に登録中" : "要復習に追加"}
                </button>
              </div>

              {/* 解説テキスト */}
              <div className="px-4 py-4">
                <h3 className="font-bold text-slate-700 mb-2 text-sm">■ 解説</h3>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                  {q.explanation}
                </p>

                {/* 補足テーブル */}
                {q.tableData && (
                  <div className="mt-4">
                    <p className="text-sm font-bold text-slate-600 mb-2">{q.tableData.caption}</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="bg-blue-600 text-white">
                            {q.tableData.headers.map((h, i) => (
                              <th key={i} className="px-3 py-2 text-left font-medium">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {q.tableData.rows.map((row, i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                              {row.map((cell, j) => (
                                <td key={j} className="px-3 py-2 border-b border-slate-100 text-slate-700">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* 次へボタン */}
              <div className="px-4 pb-4">
                <button
                  onClick={handleNext}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  {currentIdx + 1 >= questionList.length ? "結果を見る" : "次の問題へ"}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 完走画面
  if (screen === "complete") {
    const total = questionList.length;
    const pct = total > 0 ? Math.round((sessionStats.correct / total) * 100) : 0;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="text-5xl mb-4">{pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "💪"}</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">セッション完了！</h2>
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <div className="text-5xl font-bold text-blue-600 mb-1">{pct}%</div>
            <div className="text-sm text-slate-500">{total}問中 {sessionStats.correct}問正解</div>
            <div className="flex justify-center gap-6 mt-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{sessionStats.correct}</div>
                <div className="text-xs text-slate-400">正解</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{sessionStats.wrong}</div>
                <div className="text-xs text-slate-400">不正解</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setScreen("start")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              ホームへ戻る
            </button>
            <button
              onClick={() => handleStart(selectedMode)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              もう一度
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 履歴画面
  if (screen === "history") {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow-sm px-4 py-3 flex items-center gap-3">
          <button onClick={() => setScreen("start")} className="text-slate-500 hover:text-slate-800">
            <Home className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-slate-800">📋 学習履歴</h1>
        </header>
        <div className="max-w-2xl mx-auto p-4">
          <div className="space-y-2">
            {QUESTIONS.map((q) => {
              const r = userData.results[q.id];
              const isMarked = (userData.reviewFlags || []).includes(q.id);
              return (
                <div key={q.id} className="bg-white rounded-xl shadow-sm px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold bg-slate-100 text-slate-600 flex-shrink-0">
                    {q.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-800 text-sm truncate">{q.title}</div>
                    <div className="text-xs text-slate-400">{q.year}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isMarked && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                    {r ? (
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          r.lastCorrect
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {r.lastCorrect ? "○" : "×"} {r.correct}正/{r.wrong}誤
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300 px-2 py-1">未解答</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
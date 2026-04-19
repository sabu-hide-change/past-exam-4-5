// npm install lucide-react recharts firebase
import React, { useState, useEffect } from 'react';
import { Check, X, Home, ChevronRight, List, AlertCircle, Play, RotateCcw, Save, Key } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// --- Firebase Configuration ---
// TODO: 本番環境の設定値に書き換えてください
const firebaseConfig = {
  apiKey: "AIzaSyCyo4bAZwqaN2V0g91DehS6mHmjZD5XJTc",
  authDomain: "sabu-hide-web-app.firebaseapp.com",
  projectId: "sabu-hide-web-app",
  storageBucket: "sabu-hide-web-app.firebasestorage.app",
  messagingSenderId: "145944786114",
  appId: "1:145944786114:web:0da0c2d87a9e24ca6cf75b",
  measurementId: "G-XSS72H1ZKV"
};
// Firebase初期化 (try-catchで防衛)
let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase初期化エラー:", error);
}

const APP_ID = "past-exam-4-5";

// --- 問題データ ---
const quizData = [
  {
    id: 1,
    year: "令和元年 第21問",
    title: "バランスト・スコアカード",
    question: "Ｒ．Ｓ．キャプランとＤ．Ｐ．ノートンが開発したバランスト・スコアカード（BSC）は、情報通信技術（ICT）投資の評価手法の1つとして使われることがある。BSCでは4つの視点から評価するとされているが、この4つの視点に含まれないものはどれか。",
    options: ["学習と成長の視点", "競合企業の視点", "業務プロセスの視点", "顧客の視点", "財務の視点"],
    answerIndex: 1,
    explanation: "バランスト・スコアカード(BSC)は、「財務」「顧客」「業務プロセス」「学習と成長」という4つの視点から情報システムを評価・検討する手法のことです。情報システムの評価以外にも経営の様々な領域で用いられています。\n「競合企業の視点」は含まれていません。",
    visual: (
      <div className="grid grid-cols-3 gap-2 text-center text-sm my-4 bg-gray-50 p-4 rounded">
        <div className="col-start-2 border-2 border-blue-600 rounded p-2 bg-white">【財務の視点】<br/>株主に対して何をすべきか</div>
        <div className="col-start-1 col-span-3 flex justify-center items-center gap-4">
          <div className="border-2 border-blue-600 rounded p-2 bg-white w-1/3">【顧客の視点】<br/>顧客に対して何をすべきか</div>
          <div className="border-2 border-indigo-200 bg-indigo-50 rounded p-4 font-bold w-1/3">ビジョン・戦略</div>
          <div className="border-2 border-blue-600 rounded p-2 bg-white w-1/3">【業務プロセスの視点】<br/>どの業務プロセスを高めるべきか</div>
        </div>
        <div className="col-start-2 border-2 border-blue-600 rounded p-2 bg-white">【学習と成長の視点】<br/>変化・改善能力をどう維持するか</div>
      </div>
    )
  },
  {
    id: 2,
    year: "平成24年 第23問",
    title: "情報システムの投資評価",
    question: "ある中小製造企業は、顧客の要望に合わせて製品を設計・製造・販売している。今まで、受注量が少なかったことから、電話やファクシミリ等で顧客への対応をしていた。近年、海外を含めて顧客からの受注が増加している。このような状況から、受発注にかかわる処理、問い合わせやクレーム処理を含めて顧客とのコミュニケーション、社内の製造指示などをシステム化することを検討している。その検討の中での聞き取り調査の結果、経営者や従業員は、このシステム開発の投資評価をはっきりさせておきたいと考えていることが分かった。\n投資評価に関する記述として最も適切なものはどれか。",
    options: [
      "本システムの構築には多様な案が考えられるが、それらを検討する場合に、システム開発のプロジェクト遂行に関するリスクと、システムによってもたらされるベネフィットとの2軸の視点から、それらの案を評価するポートフォリオ分析が有用である。",
      "本システムへの投資をTCOで評価する場合、従業員の教育などにかかわる技術サポートコスト、セキュリティ管理などにかかわる管理コスト、コンピュータの利用にかかわるエンドユーザコストの3つの視点から行う。",
      "本システムを評価する場合、顧客がどう評価するかが重要であり、このような視点から、顧客ならば提案されたシステムをいくらなら購入するかを算定してもらうリアルオプションプライシングと言われる手法を採用することが妥当である。",
      "本来、システム導入は合理化のためであり、従って、システム導入に際して従業員何人を減らすことができるかを算定できれば、本システムの投資価値は判断できる。"
    ],
    answerIndex: 0,
    explanation: "ポートフォリオ分析とは、重要な2つの指標を組み合わせることで最適な戦略を選択するための手法です。情報システム投資では、システム開発のプロジェクト遂行に関するリスクと、システムによってもたらされるベネフィットとの軸で分析することは、投資評価の方法として有用といえます。\nイ: TCOにはシステム開発費やハード・ソフト費用も含まれるため不適切。\nウ: リアルオプションは金融工学のオプション理論を投資評価に応用した手法であり、顧客に購入金額を算出してもらう手法ではないため不適切。\nエ: 人員削減だけが投資価値ではないため不適切。",
    visual: (
      <div className="my-4 p-4 bg-gray-100 rounded">
        <div className="text-center font-bold mb-2">ITプロジェクトポートフォリオの例</div>
        <div className="grid grid-cols-2 gap-1 text-center text-sm border-2 border-gray-400 p-1">
          <div className="bg-teal-600 text-white p-4">投資価値:大 / リスク:大<br/>→冒険</div>
          <div className="bg-blue-400 text-white p-4">投資価値:大 / リスク:小<br/>→最優先</div>
          <div className="bg-blue-600 text-white p-4">投資価値:小 / リスク:大<br/>→見送り</div>
          <div className="bg-teal-400 text-white p-4">投資価値:小 / リスク:小<br/>→安定志向</div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    year: "令和4年 第4問",
    title: "データレイク",
    question: "データを格納する考え方としてデータレイクが注目されている。データレイクに関する記述として、最も適切なものはどれか。",
    options: [
      "組織内で運用される複数のリレーショナルデータベースからデータを集めて格納する。",
      "組織内の構造化されたデータや、IoT 機器やSNS などからの構造化されていないデータをそのままの形式で格納する。",
      "データウェアハウスから特定の用途に必要なデータを抽出し、キー・バリュー型の形式で格納する。",
      "データ利用や分析に適したスキーマをあらかじめ定義して、その形式にしたがってデータを格納する。",
      "テキスト形式のデータと画像・音声・動画などのバイナリ形式のデータをそれぞれ加工し、構造化したうえで格納する。"
    ],
    answerIndex: 1,
    explanation: "データレイクとは、データソースとなる基幹系システムなどから収集してきたデータを加工せずそのまま保存しておくリポジトリのことです。組織内の構造化されたデータや、IoT機器やSNSなどからの構造化されていないデータをそのままの形式で格納します。\nア・エはリレーショナルデータベースの特徴。ウは特定の用途に限定せず保存するため不適切。オは加工や構造化をしないため不適切。",
    table: [
      { term: "データウェアハウス(DWH)", desc: "基幹系システムで発生したデータを蓄積して、意思決定に活用できるようにしたデータベース。" },
      { term: "リレーショナルデータベース", desc: "データベースの構造をあらかじめ定義して、形式に従ってデータを蓄積。高速に検索や集計が可能。" },
      { term: "データレイク", desc: "構造化・非構造化データを加工せずそのまま保存。未知の相関関係を見出すための多角的な分析に対応。" }
    ]
  },
  {
    id: 4,
    year: "平成27年 第13問",
    title: "経営情報システム",
    question: "企業経営における情報技術の利用が進み、その重要性が増す中で、情報技術を利用するシステムやシステム化指針を省略語もしくはカタカナ語として言い表すことが多くなった。それらに関する記述として最も適切なものはどれか。",
    options: [
      "PERT/CPMで用いられるクリティカルパス法と情報技術を組み合わせて、顧客と企業との間の業務フローの最適化を行うためのシステムをCRMと呼ぶ。",
      "企業を構成する様々な部門・業務で扱う資源を統一的・一元的に管理することを可能にするシステムをERPと呼ぶ。",
      "クラウドコンピューティングの多様なサービスが展開されているが、その中から最適なサービスを選択するシステム化指針をクラウドソーシングと呼ぶ。",
      "クラウドコンピューティングの利用に際して、社内にサーバを設置して情報の漏えいを防ぐシステム化指針をインソーシングと呼ぶ。"
    ],
    answerIndex: 1,
    explanation: "ERP（Enterprise Resource Planning）は、企業の基幹業務を統合的に管理するパッケージです。企業の経営資源である人、モノ、金、情報などを、全体最適の視点から適切に計画し、管理することができます。\nア: CRMは顧客との関係を維持・構築する手法。ウ: クラウドソーシングは不特定多数の人に業務を委託すること。エ: インソーシングは外部委託していた業務を再び自社内で行うこと。"
  },
  {
    id: 5,
    year: "令和元年 第15問",
    title: "ERP",
    question: "「ERP（Enterprise Resource Planning）システム」に関する記述として、最も適切なものはどれか。",
    options: [
      "基幹業務プロセスの実行を、統合業務パッケージを利用して、必要な機能を相互に関係付けながら支援する総合情報システムである。",
      "基幹業務プロセスをクラウド上で処理する統合情報システムである。",
      "企業経営に必要な諸資源を統合的に管理するシステムである。",
      "企業経営の持つ諸資源の戦略的な活用を計画するためのシステムである。"
    ],
    answerIndex: 0,
    explanation: "ERPシステムとは、会計・販売・生産・購買・物流・人事などの企業の主要な業務を１つのパッケージソフトで総合管理できるものです。よってアが最も適切です。\nイ: 常にクラウド上とは限らない。ウ: 「統合業務パッケージ」の言及があるアの方がシステムとしてより適切。エ: 戦略的な活用の計画までは行われない。"
  },
  {
    id: 6,
    year: "令和5年 第16問",
    title: "OLAP",
    question: "OLAP は、ビジネスインテリジェンス（BI）に用いられる主要な技術の 1 つである。OLAP に関する記述として、最も適切なものはどれか。",
    options: [
      "HOLAP とは、Hadoop と呼ばれる分散処理技術を用いたものをいう。",
      "MOLAP とは、多次元データを格納するのにリレーショナルデータベースを用いたものをいう。",
      "ROLAP とは、多数のトランザクションをリアルタイムに実行するものをいう。",
      "ダイシングとは、多次元データの分析軸を入れ替えて、データの切り口を変えることをいう。",
      "ドリルスルーとは、データ集計レベルを変更して異なる階層の集計値を参照することをいう。"
    ],
    answerIndex: 3,
    explanation: "ダイシングとは、多次元データの分析軸を入れ替えて（サイコロを転がすように）、データの切り口を変えることを言います。\nア: HOLAPは分散処理ではなくハイブリッド型。イ: MOLAPは多次元DBを用いる。ウ: ROLAPはリレーショナルDBを用いる。オ: ドリルスルーは関連する別の詳細レポートを開く機能。"
  },
  {
    id: 7,
    year: "令和3年 第8問",
    title: "データ分析",
    question: "意思決定や計画立案のために、組織内で運用される情報システムやデータベースなどからデータを集めて格納しておく場所を（ Ａ ）と呼ぶ。この（ Ａ ）から、必要なものだけを利用しやすい形式で格納したデータベースを（ Ｂ ）と呼ぶ。このような構造化されたデータに加えて、IoT 機器や SNS などからの構造化されていないデータを、そのままの形式で格納しておく（ Ｃ ）が利用されつつある。膨大なデータを蓄積する必要があるため、比較的安価なパブリッククラウドのオブジェクトストレージに格納される場合が多い。収集されたデータの品質を高めるためには、データ形式の標準化や（ Ｄ ）が重要である。",
    options: [
      "Ａ：データウェアハウス　Ｂ：データマート　Ｃ：データレイク　Ｄ：データクレンジング",
      "Ａ：データウェアハウス　Ｂ：データレイク　Ｃ：データスワンプ　Ｄ：データクレンジング",
      "Ａ：データマート　Ｂ：データウェアハウス　Ｃ：データプール　Ｄ：データマイグレーション",
      "Ａ：データマート　Ｂ：リレーショナルデータベース　Ｃ：データレイク　Ｄ：データマイグレーション",
      "Ａ：データレイク　Ｂ：データマート　Ｃ：データプール　Ｄ：データマイニング"
    ],
    answerIndex: 0,
    explanation: "A: データウェアハウス (全社のデータを蓄積)\nB: データマート (特定の部門や目的別に抽出)\nC: データレイク (構造化・非構造化データをそのまま格納)\nD: データクレンジング (データの誤り修正や重複排除などで品質を高める処理)",
    visual: (
      <div className="my-4 p-4 bg-white border rounded shadow-sm text-sm">
        <div className="font-bold text-center mb-2">◆BIのデータの流れ</div>
        <div className="flex flex-col gap-2 items-center">
          <div className="bg-blue-100 p-2 rounded">基幹系システム</div>
          <div>↓ 収集</div>
          <div className="bg-blue-200 p-2 rounded text-center">
            データレイク<br/>(そのまま保存)
          </div>
          <div>↓ 抽出・変換</div>
          <div className="bg-blue-300 p-2 rounded text-center">
            データウェアハウス<br/>(全社蓄積)
          </div>
          <div>↓ 抽出</div>
          <div className="bg-blue-400 p-2 rounded text-center">
            データマート<br/>(目的別)
          </div>
        </div>
      </div>
    )
  },
  {
    id: 8,
    year: "平成29年 第7問",
    title: "Webマーケティングに関する知識",
    question: "検索サイトは、インターネット上にあるWebサイト内の情報を（ Ａ ）と呼ばれる仕組みで収集し、検索用のデータベースに登録する。\n検索サイトに対して利用者からあるキーワードで検索要求が出された場合、検索サイトは、独自の（ Ｂ ）によって求めた優先度をもとに、その上位から検索結果を表示している。\nWebサイト運営者は、Webコンテンツの内容が検索結果の上位に表示されるような施策を行う必要があり、（ Ｃ ）対策と呼ばれる。これにはブラックハット対策と（ Ｄ ）対策がある。",
    options: [
      "Ａ：ガーベージ　　Ｂ：アルゴリズム　　Ｃ：SERP　　Ｄ：ホワイトハット",
      "Ａ：クローラ　　　Ｂ：アルゴリズム　　Ｃ：SEO　　Ｄ：ホワイトハット",
      "Ａ：クローラ　　　Ｂ：ハッシュ　　　　Ｃ：KGI　　Ｄ：ブルーハット",
      "Ａ：スパイダー　　Ｂ：メトリクス　　　Ｃ：SEM　　Ｄ：グレーハット"
    ],
    answerIndex: 1,
    explanation: "A: インターネット上の情報を収集するプログラムは「クローラ」または「スパイダー」。\nB: 検索結果の順位を決定する計算手順は「アルゴリズム」。\nC: 検索結果で上位表示させる施策は「SEO (Search Engine Optimization)」。\nD: ガイドラインに従った正当なSEO対策は「ホワイトハット」。"
  },
  {
    id: 9,
    year: "平成30年 第13問",
    title: "検索エンジンのフィルターバブル",
    question: "検索エンジンによる情報収集では、「フィルターバブル」と呼ばれる弊害も指摘されている。フィルターバブルに関する記述として、最も適切なものはどれか。",
    options: [
      "虚偽の情報から作られたニュースがまん延することで、利用者の正しい判断を阻害することが懸念されている。",
      "検索結果の記事に広告を自然に溶け込ませて提示するために、利用者の情報収集が妨げられることが懸念されている。",
      "不自然な外部リンクを増やすなどして検索結果の表示順序を意図的に操作できるために、必要な情報にたどり着くことが困難になることが懸念されている。",
      "利用者の過去の検索履歴などに応じた情報を優先的に提示する傾向があるために、利用者の目に触れる情報に偏りの生じることが懸念されている。"
    ],
    answerIndex: 3,
    explanation: "検索エンジンのフィルターバブルとは、アルゴリズムの学習によって、消費者の好む情報ばかりが優先的に表示され、見たくない情報や異なる意見に触れなくなり、自分の価値観の泡（バブル）に包まれたようになる現象のことです。\nアはフェイクニュース、イはネイティブ広告、ウはブラックハットSEOの説明です。"
  },
  {
    id: 10,
    year: "平成25年 第16問",
    title: "クラウドサービスの活用",
    question: "クラウドサービスの活用に関する記述として最も適切なものはどれか。",
    options: [
      "クラウドサービス事業者がSaaSを提供しているとき、それに必要なサーバを自社で持っていない場合がある。",
      "クラウドサービス事業者がパスワードリセット機能を提供している場合、ユーザ企業ではクラウドサービスのすべての利用者にその方法を伝えて、パスワードを自分で再設定できるようにしておくのがよい。",
      "クラウドサービス事業者がバックアップをアーカイブとして確保しているので、ユーザ企業側でバックアップする必要はない。",
      "クラウドサービスの稼働率がSLA（Service Level Agreement）で年99.9％以上と保証されていれば、不慮のサービス停止の場合でも1時間以内に稼働状態に復旧できる。"
    ],
    answerIndex: 0,
    explanation: "クラウドサービス事業者がSaaSを提供するとき、その事業者自身が他のIaaSを利用してサーバを自社で持たないことが可能です。よってアが正解。\nイ: パスワードリセットの乱用は不正アクセスリスクを高める。ウ: ユーザ企業側でもバックアップを行う方が安全。エ: 稼働率99.9%の場合、年間の停止時間は約8.76時間となり1時間以内の復旧は保証されません。"
  },
  {
    id: 11,
    year: "平成28年 第22問",
    title: "クラウドサービスの活用2",
    question: "クラウドサービスやその利用に関する記述として最も適切なものはどれか。",
    options: [
      "クラウドサービスにおいては、情報セキュリティの確保が重要になるが、独立行政法人情報処理推進機構ではクラウドサービスの安全利用に関する手引きを出している。",
      "クラウドサービスの利用料金の多くはサービス内容に応じて異なるが、使用したデータ容量では異ならないので、コストの視点から大企業の多くがクラウドサービスを利用し始めている。",
      "パブリッククラウドの形態には、SaaS、PaaS、IaaS、DaaSなどがあり、いずれもアプリケーション、ミドルウェア、OS、ハードウェアが一体化されたサービスとしてエンドユーザに提供される。",
      "オンプレミス型クラウドサービスとは自社でインフラを持たずクラウド事業者からサービスの提供を受ける形態をいい、ホステッド型クラウドサービスとは自社でインフラを持つ企業内クラウドの形態をいう。"
    ],
    answerIndex: 0,
    explanation: "IPA（情報処理推進機構）は「中小企業のためのクラウドサービス安全利用の手引き」を策定しています。よってアが適切。\nイ: データ容量で料金が異なるサービスも存在する。ウ: IaaSなどはOS・アプリケーションまでは提供しないなど提供範囲が異なる。エ: オンプレミスとホステッドの説明が逆。",
    visual: (
      <div className="my-4">
        <div className="font-bold mb-2">クラウドサービスの提供範囲の違い</div>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-gray-100 p-2">
            <div className="font-bold mb-1">IaaS</div>
            <div className="bg-blue-200 p-1 mb-1">サーバ・NW</div>
          </div>
          <div className="bg-gray-100 p-2">
            <div className="font-bold mb-1">PaaS</div>
            <div className="bg-green-200 p-1 mb-1">ミドルウェア・OS</div>
            <div className="bg-blue-200 p-1 mb-1">サーバ・NW</div>
          </div>
          <div className="bg-gray-100 p-2">
            <div className="font-bold mb-1">SaaS</div>
            <div className="bg-orange-200 p-1 mb-1">アプリケーション</div>
            <div className="bg-green-200 p-1 mb-1">ミドルウェア・OS</div>
            <div className="bg-blue-200 p-1 mb-1">サーバ・NW</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 12,
    year: "令和4年 第12問",
    title: "クラウドコンピューティング",
    question: "以下の記述のうち、最も適切な組み合わせを選べ。\nａ　システムを構成するサーバの台数を増やすことでシステム全体の処理能力を高めることを、スケールアウトという。\nｂ　システムを構成するサーバを高性能なものに取り替えることでシステム全体の処理能力を高めることを、スケールアップという。\nｃ　既存のハードウェアやソフトウェアを同等のシステム基盤へと移すことを、リファクタリングという。\nｄ　パッケージソフトウェアを新しいバージョンに移行する時などに行われ、データやファイルを別の形式に変換することを、リフト＆シフトという。\nｅ　情報システムをクラウドに移行する手法の1 つで、既存のシステムをそのままクラウドに移し、漸進的にクラウド環境に最適化していく方法を、コンバージョンという。",
    options: ["ａとｂ", "ａとｅ", "ｂとｃ", "ｃとｄ", "ｄとｅ"],
    answerIndex: 0,
    explanation: "a(スケールアウト)とb(スケールアップ)の説明は適切。\nｃはリプレイスの説明。ｄはコンバージョンの説明。ｅはリフト＆シフトの説明です。"
  },
  {
    id: 13,
    year: "平成25年 第15問",
    title: "ビッグデータ",
    question: "ビッグデータに関する記述として最も適切なものはどれか。",
    options: [
      "ビッグデータ活用で発展が期待されている経済産業省の｢IT融合新産業｣とは、IT産業の構造変化によって創出される新ビジネスのことである。",
      "ビッグデータ活用の鍵となるC2Cは、インターネットで連結されたデータ通信の技術である。",
      "ビッグデータ活用の鍵となるM2Mは、人間と機械との間の自動データ連携の技術である。",
      "ビッグデータの活用では、業務取引上生成される構造化データだけでなく非構造化データも注目されている。"
    ],
    answerIndex: 3,
    explanation: "ビッグデータの活用では、データベースで管理しやすい構造化データだけでなく、電子メール・画像・動画などの非構造化データも注目されています。よってエが正解。\nア: IT産業内に留まらない広範なビジネス。イ: C2CはConsumer to Consumerの取引。ウ: M2Mは機械同士の通信(Machine to Machine)。"
  },
  {
    id: 14,
    year: "平成30年 第14問",
    title: "ビッグデータ、ブロックチェーン",
    question: "ネットワークに関する記述として、最も適切なものはどれか。",
    options: [
      "次数分布がべき乗則に従う、インターネットなどで見られるスケールフリー・ネットワークには、ハブと呼ばれる次数の大きなノードが存在する。",
      "ブロックチェーンとは、Web上に仮想的な金融機関を置き、金融取引の履歴をWeb上のデータベースに一元管理するネットワークをいう。",
      "メトカーフの法則は、デジタルデータの爆発的な増大を背景に、ノードの増加と共に価値が指数関数的に増えていく状況を表している。",
      "リンクポピュラリティは、ネットワーク分析で使う指標の1つで、あるノードを通る経路が多いほど大きくなる。"
    ],
    answerIndex: 0,
    explanation: "スケールフリー・ネットワークとは、一部のノードに無数のリンクが集中しハブとなるネットワークの形態です。アが正解。\nイ: ブロックチェーンは中央管理しない分散型。ウ: メトカーフの法則は利用者の数の2乗に比例。エ: リンクポピュラリティは外部から集まるリンクの質と量で評価するSEOの考え方。"
  },
  {
    id: 15,
    year: "令和5年 第15問",
    title: "情報化社会の将来像",
    question: "情報化社会の将来像に関する考え方についての記述として、最も適切なものはどれか。",
    options: [
      "「DX」とは、人件費削減を目的として、企業組織内のビジネスプロセスのデジタル化を進め、人間の仕事を AI やロボットに行わせることを指している。",
      "「Society5.0」とは、サイバー空間（仮想空間）とフィジカル空間（現実空間）を高度に融合させたシステムにより、経済発展と社会的課題の解決を両立させる人間中心の社会を指している。",
      "「Web3.0」とは、情報の送り手と受け手が固定されて送り手から受け手への一方的な流れであった状態が、送り手と受け手が流動化して誰でも Web を通じて情報を受発信できるようになった状態を指している。",
      "「インダストリー 4.0」とは、ドイツ政府が提唱した構想であり、AI を活用して人間の頭脳をロボットの頭脳に代替させることを指している。",
      "「第三の波」とは、農業革命（第一の波）、産業革命（第二の波）に続いて、第三の波としてシンギュラリティが訪れるとする考え方を指している。"
    ],
    answerIndex: 1,
    explanation: "Society5.0は、サイバー空間とフィジカル空間を高度に融合させたシステムにより、経済発展と社会的課題の解決を両立する人間中心の社会です。イが正解。\nアは単なるAI/ロボット化。ウはWeb2.0の説明。エはIoT活用のスマート工場が主体。オは情報革命のこと。"
  },
  {
    id: 16,
    year: "令和4年 第25問",
    title: "ブロックチェーン技術",
    question: "ブロックチェーン技術に関する記述として、最も適切なものはどれか。",
    options: [
      "NFT（Non-Fungible Token）は、ブロックチェーン技術を基に作られた一意で代替不可能なトークンであり、デジタルコンテンツに対応したNFT を発行することにより唯一性・真正性を証明できる。",
      "PoW（Proof of Work）とは、ブロックチェーン上に新たなトランザクションを追加するための合意形成メカニズムの1 つで、承認権限を持つ人のコンセンサスで決める。",
      "スマートコントラクトは、ブロックチェーン上に保存されたプログラムコードのことであり、暗号資産の取引に限定して利用される。",
      "ブロックチェーンネットワークでは、パブリック型、コンソーシアム型、プライベート型のいずれにおいても中央管理者を置くことはない。",
      "ブロックチェーンはブロック間のデータの連続性を保証する技術の1 つであり、追加されたブロックが前のブロックのナンス値を保持することによって連続性が確保されている。"
    ],
    answerIndex: 0,
    explanation: "NFTは代替不可能なトークンであり、デジタルコンテンツの唯一性・真正性を証明できます。アが正解。\nイ: PoWは計算作業による合意形成。ウ: 暗号資産に限定されない。エ: コンソーシアム・プライベート型は管理者が存在。オ: 前のブロックの「ハッシュ値」を保持することで連続性を確保する。"
  },
  {
    id: 17,
    year: "令和4年 第15問",
    title: "機械学習の手法",
    question: "機械学習の手法に関する記述として、最も適切な組み合わせを選べ。\nａ　クラスタリングはカテゴリ型変数を予測する手法であり、教師あり学習に含まれる。\nｂ　クラスタリングはデータをグループに分ける手法であり、教師なし学習に含まれる。\nｃ　分類はカテゴリ型変数を予測する手法であり、教師あり学習に含まれる。\nｄ　分類はデータをグループに分ける手法であり、教師あり学習に含まれる。\nｅ　回帰はデータをグループに分ける手法であり、教師なし学習に含まれる。",
    options: ["ａとｄ", "ａとｅ", "ｂとｃ", "ｂとｄ", "ｃとｅ"],
    answerIndex: 2,
    explanation: "ｂ: クラスタリングはデータをグループに分ける手法であり、教師なし学習です。\nｃ: 分類はカテゴリ型変数を予測する手法であり、教師あり学習です。\nよって「ｂとｃ」のウが正解です。"
  },
  {
    id: 18,
    year: "令和5年 第25問",
    title: "インターネット上での情報流通の特徴",
    question: "人間は集団になると、個人でいるときよりも極端な方向に走りやすくなるという心理的傾向は（ Ａ ）と呼ばれている。キャス・サンスティーンは、インターネットでも（ Ａ ）を引き起こしやすくなる（ Ｂ ）という現象が見られると指摘した。\n1 つは、自分と似た興味関心を持つユーザをフォローするため、似た意見が返ってくる（ Ｃ ）と呼ばれる現象。もう 1 つは、アルゴリズムが学習し見たい情報しか見えなくなる（ Ｄ ）と呼ばれる現象である。",
    options: [
      "Ａ：集団極性化　Ｂ：サイバーカスケード　Ｃ：エコーチェンバー　Ｄ：フィルターバブル",
      "Ａ：集団極性化　Ｂ：サイバーカスケード　Ｃ：バックファイア効果　Ｄ：エゴサーチ",
      "Ａ：ハロー効果　Ｂ：サイバーカスケード　Ｃ：バックファイア効果　Ｄ：エゴサーチ",
      "Ａ：ハロー効果　Ｂ：ナッジ　Ｃ：エコーチェンバー　Ｄ：フィルターバブル",
      "Ａ：ハロー効果　Ｂ：ナッジ　Ｃ：バックファイア効果　Ｄ：フィルターバブル"
    ],
    answerIndex: 0,
    explanation: "A: 集団極性化\nB: サイバーカスケード\nC: エコーチェンバー\nD: フィルターバブル\n以上からアが正解です。"
  },
  {
    id: 19,
    year: "平成25年 第14問",
    title: "ソーシャルメディア",
    question: "ソーシャルメディアを利用する上での要点や対処法に関する記述として最も適切なものはどれか。",
    options: [
      "個人が開設したブログに社内で起こった出来事を書いたが、社外秘の情報が含まれていたので不適切だと分かった。翌日に削除すれば問題はない。",
      "自分の店舗に来た人の名前を、当人の了解を得ずソーシャルメディアに投稿して広告として利用しても、店舗は公共の場所なので問題はない。",
      "ソーシャルメディアに投稿したすべての内容は、一定期間保存された後、新規投稿内容で上書きされるので、何を投稿してもよい。",
      "自らがソーシャルメディアを使わなくても、ソーシャルメディアの炎上に巻き込まれることがある。"
    ],
    answerIndex: 3,
    explanation: "悪意を持った第三者の書き込みなどにより、自らが利用していなくても炎上に巻き込まれる可能性があります。エが正解。\nア・イ・ウはいずれもネットのリスクやプライバシー侵害を軽視しており不適切です。"
  },
  {
    id: 20,
    year: "平成25年 第3問",
    title: "スマートフォン、その他",
    question: "スマートフォン、パソコン、メインフレームなど多様な情報機器を有効に連携させてビジネスに利用するケースが増えてきた。それらの機器や連携に関する記述として最も適切なものはどれか。",
    options: [
      "スマートフォンで作ったテキストデータはメインフレームでは利用できない。",
      "スマートフォンのアプリケーションは、パソコンでも作ることが可能である。",
      "スマートフォンはOSを利用しない。",
      "パソコン用のアプリケーションはメインフレームに対して上位互換になっているので、メインフレームでも使うことができる。"
    ],
    answerIndex: 1,
    explanation: "スマートフォンのアプリケーションは一般的にパソコン上で開発されます。イが正解。\nア: 条件が揃えば利用可能。ウ: AndroidやiOSといったOSを利用します。エ: OSが異なるため互換性はなく、上位互換でもありません。"
  },
  {
    id: 21,
    year: "平成26年 第19問",
    title: "BYOD",
    question: "BYOD（Bring Your Own Device）に関する記述として最も適切なものはどれか。",
    options: [
      "BYODを導入するとともに、自社サーバの機能をクラウドサービスに移行すれば、BCP対策の一環となる。",
      "MDMとは、持ち込まれる端末のデータべース管理システムを統一することを指す。",
      "シャドーITとは、会社所有の情報機器と同じハード、ソフトからなる端末に限定して持ち込みを許可することを指す。",
      "端末を紛失した場合などに対処するため、遠隔操作でデータを消去するローカルワイプと呼ばれる機能がある。"
    ],
    answerIndex: 0,
    explanation: "BYODとクラウド化は、有事の際でも自宅等から業務継続を可能にするため、BCP（事業継続計画）対策の一環となります。アが正解。\nイ: MDMはモバイル端末の統合管理手法。ウ: シャドーITは企業の承認なく従業員が勝手に利用するITのこと。エ: 遠隔操作でのデータ消去はリモートワイプ。"
  },
  {
    id: 22,
    year: "令和2年 第24問",
    title: "統計分析の手法",
    question: "以下の状況において、どのような分析手法が適切か。最も適切な組み合わせを選べ。\nａ　3つの事業部で売上高利益率に差異が見られるのかを検討したい。\nｂ　どの変数が売上高にどの程度寄与しているのかを検討したい。\nｃ　顧客の特性にあったマーケティング活動をしたいので、顧客を分類したい。\nｄ　Webサイトの候補として2つのパターンがある。どちらのパターンを採用するかを決めたい。",
    options: [
      "ａ：判別分析　ｂ：回帰分析　ｃ：コンジョイント分析　ｄ：A/B 分析",
      "ａ：判別分析　ｂ：相関分析　ｃ：コンジョイント分析　ｄ：アクセス分析",
      "ａ：分散分析　ｂ：回帰分析　ｃ：クラスター分析　ｄ：A/B 分析",
      "ａ：分散分析　ｂ：相関分析　ｃ：クラスター分析　ｄ：アクセス分析"
    ],
    answerIndex: 2,
    explanation: "a: 3つ以上の集団における平均の差異の分析 → 分散分析\nb: 結果と要因の関係性を分析 → 回帰分析\nc: 類似点でグループに分ける → クラスター分析\nd: 複数案を比較検証する → A/B分析"
  },
  {
    id: 23,
    year: "平成25年 第23問",
    title: "ISMS",
    question: "組織の情報セキュリティ基準として、｢情報セキュリティマネジメントシステム（ISMS）適合性評価制度｣が広く使われている。これに関する記述として最も適切なものはどれか。",
    options: [
      "JIS Q 20000-1 適合性に関する制度である。",
      "適合性の認証制度は、｢認証機関｣、｢要員認証機関｣、｢認定機関｣からなる仕組みである。",
      "適合性の認証登録後は、10年ごとに再認証審査を行う。",
      "標準として決められたセキュリティレベルでのシステム運用を求める。"
    ],
    answerIndex: 1,
    explanation: "ISMS適合性評価制度は、「認証機関」、「要員認証機関」、および「認定機関」からなる仕組みです。イが正解。\nア: JIS Q 27001に適合しているか審査します。ウ: 認証登録後、3年ごとに再認証審査を行います。エ: 標準ではなく、組織が自ら必要なセキュリティレベルを決定することを求めます。"
  },
  {
    id: 24,
    year: "令和元年 第25問",
    title: "標準化推進組織",
    question: "標準化を進める組織に関する文章の空欄Ａ～Ｄに入る組み合わせとして適切なものを選べ。\n（ Ａ ） は、世界 160 カ国以上の国家規格団体が加盟する世界的規模の非政府組織。\n（ Ｂ ） は、国際連合の専門機関であり、情報通信分野の国際標準の策定を図る。\n（ Ｃ ） は、LAN やイーサネットなどの通信方式や電子部品の研究や標準化を行う学会。\n（ Ｄ ） は、インターネットの Web に関する技術の標準化を進める非営利団体。",
    options: [
      "Ａ：IEEE　Ｂ：ITU　Ｃ：ISO　Ｄ：W3C",
      "Ａ：ISO　Ｂ：ITU　Ｃ：IEEE　Ｄ：W3C",
      "Ａ：ISO　Ｂ：W3C　Ｃ：IEEE　Ｄ：ITU",
      "Ａ：ITU　Ｂ：ISO　Ｃ：W3C　Ｄ：IEEE"
    ],
    answerIndex: 1,
    explanation: "A: ISO（国際標準化機構）\nB: ITU（国際電気通信連合）\nC: IEEE（米国電気電子学会）\nD: W3C（World Wide Web Consortium）"
  }
];

export default function App() {
  const [screen, setScreen] = useState('login'); // login, start, quiz, result, history
  const [userId, setUserId] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [userData, setUserData] = useState({ answers: {}, review: {}, progressIndex: 0, progressMode: "all" });
  const [loading, setLoading] = useState(false);
  
  // クイズ状態
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMode, setCurrentMode] = useState("all"); // all, wrong, review
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // --- Firebase Operations ---
  const loadUserData = async (uid) => {
    if (!db) return;
    setLoading(true);
    try {
      const docRef = doc(db, APP_ID, uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData({
          answers: docSnap.data().answers || {},
          review: docSnap.data().review || {},
          progressIndex: docSnap.data().progressIndex || 0,
          progressMode: docSnap.data().progressMode || "all"
        });
        console.log("データロード成功:", docSnap.data());
      } else {
        setUserData({ answers: {}, review: {}, progressIndex: 0, progressMode: "all" });
      }
    } catch (e) {
      console.error("ロードエラー:", e);
    } finally {
      setLoading(false);
    }
  };

  const saveUserData = async (updates) => {
    if (!db || !userId) return;
    try {
      const docRef = doc(db, APP_ID, userId);
      await setDoc(docRef, updates, { merge: true });
      console.log("データ保存成功:", updates);
    } catch (e) {
      console.error("保存エラー:", e);
    }
  };

  // --- Handlers ---
  const handleLogin = () => {
    if (!inputCode.trim()) return;
    setUserId(inputCode.trim());
    loadUserData(inputCode.trim());
    setScreen('start');
  };

  const startQuiz = (mode, resume = false) => {
    let targetQuestions = [];
    if (mode === 'all') {
      targetQuestions = [...quizData];
    } else if (mode === 'wrong') {
      targetQuestions = quizData.filter(q => userData.answers[q.id] === false);
    } else if (mode === 'review') {
      targetQuestions = quizData.filter(q => userData.review[q.id] === true);
    }

    if (targetQuestions.length === 0) {
      alert("対象の問題がありません。");
      return;
    }

    setFilteredQuestions(targetQuestions);
    setCurrentMode(mode);
    setIsAnswered(false);
    setSelectedOption(null);

    const startIndex = resume ? (userData.progressIndex || 0) : 0;
    setCurrentIndex(startIndex);
    
    if (!resume) {
      saveUserData({ progressIndex: 0, progressMode: mode });
    }
    
    setScreen('quiz');
  };

  const handleAnswer = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const currentQ = filteredQuestions[currentIndex];
    const isCorrect = index === currentQ.answerIndex;

    const newAnswers = { ...userData.answers, [currentQ.id]: isCorrect };
    setUserData(prev => ({ ...prev, answers: newAnswers }));
    saveUserData({ answers: newAnswers });
  };

  const toggleReview = () => {
    const currentQ = filteredQuestions[currentIndex];
    const newReviewState = !userData.review[currentQ.id];
    const newReview = { ...userData.review, [currentQ.id]: newReviewState };
    setUserData(prev => ({ ...prev, review: newReview }));
    saveUserData({ review: newReview });
  };

  const nextQuestion = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setIsAnswered(false);
      setSelectedOption(null);
      // 進捗を保存
      saveUserData({ progressIndex: nextIdx, progressMode: currentMode });
    } else {
      // 完走した場合は進捗リセット
      saveUserData({ progressIndex: 0 });
      setUserData(prev => ({ ...prev, progressIndex: 0 }));
      setScreen('result');
    }
  };

  const resetAndGoHome = () => {
    // 途中でやめる場合も進捗は保存されているのでそのままホームへ
    setScreen('start');
  };

  // --- Screens ---
  if (loading) {
    return <div className="flex h-screen items-center justify-center text-xl font-bold">Loading...</div>;
  }

  if (screen === 'login') {
    return (
      <div className="flex flex-col h-screen bg-gray-100 items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <Key className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <h1 className="text-2xl font-bold mb-6">経営情報システム 演習</h1>
          <p className="text-sm text-gray-600 mb-4">合言葉を入力して学習データを同期します</p>
          <input 
            type="text" 
            className="w-full border p-3 rounded mb-4 focus:outline-blue-500"
            placeholder="ユーザーID / 合言葉"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button 
            className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700"
            onClick={handleLogin}
          >
            ログイン / はじめる
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'start') {
    const hasProgress = userData.progressIndex > 0;
    
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">問題集メニュー</h1>
          <div className="text-center text-sm text-gray-500 mb-6">ID: {userId}</div>

          {hasProgress && (
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
              <p className="text-sm text-blue-800 font-bold mb-3 text-center">
                前回は【{userData.progressMode === 'all' ? '全て' : userData.progressMode === 'wrong' ? '不正解' : '要復習'}の第{userData.progressIndex + 1}問】まで進んでいます。
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => startQuiz(userData.progressMode, true)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded text-sm font-bold flex items-center justify-center gap-1 hover:bg-blue-700"
                >
                  <Play size={16} /> 続きから再開
                </button>
                <button 
                  onClick={() => {
                    saveUserData({ progressIndex: 0 });
                    setUserData(p => ({ ...p, progressIndex: 0 }));
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded text-sm font-bold flex items-center justify-center gap-1 hover:bg-gray-300"
                >
                  <RotateCcw size={16} /> 最初からにする
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button onClick={() => startQuiz('all')} className="w-full p-4 border rounded text-left font-bold hover:bg-gray-50 flex justify-between items-center">
              <span>すべての問題 (全{quizData.length}問)</span>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <button onClick={() => startQuiz('wrong')} className="w-full p-4 border rounded text-left font-bold hover:bg-gray-50 flex justify-between items-center text-red-600">
              <span>前回不正解の問題のみ</span>
              <ChevronRight size={20} className="text-red-400" />
            </button>
            <button onClick={() => startQuiz('review')} className="w-full p-4 border rounded text-left font-bold hover:bg-gray-50 flex justify-between items-center text-orange-600">
              <span>要復習の問題のみ</span>
              <ChevronRight size={20} className="text-orange-400" />
            </button>
          </div>

          <hr className="my-6" />

          <button 
            onClick={() => setScreen('history')}
            className="w-full bg-indigo-50 text-indigo-700 p-4 rounded font-bold hover:bg-indigo-100 flex justify-center items-center gap-2"
          >
            <List size={20} />
            学習履歴を確認する
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'quiz') {
    const q = filteredQuestions[currentIndex];
    
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 p-2 md:p-6">
        <div className="max-w-3xl mx-auto w-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 bg-white p-3 rounded shadow-sm">
            <button onClick={resetAndGoHome} className="text-gray-500 hover:text-gray-800 p-2 rounded">
              <Home size={24} />
            </button>
            <div className="font-bold text-gray-700">
              問題 {currentIndex + 1} / {filteredQuestions.length}
            </div>
            <button onClick={toggleReview} className={`p-2 rounded flex items-center gap-1 ${userData.review[q.id] ? 'text-orange-600 bg-orange-50 font-bold' : 'text-gray-400'}`}>
              <AlertCircle size={20} />
              <span className="text-sm hidden sm:inline">要復習</span>
            </button>
          </div>

          {/* Question */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-4">
            <div className="flex flex-wrap items-baseline gap-2 mb-4">
              <h2 className="text-xl font-bold text-gray-800">Q. {q.title}</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{q.year}</span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{q.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {q.options.map((opt, idx) => {
              let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
              
              if (!isAnswered) {
                btnClass += "border-gray-200 hover:border-blue-400 hover:bg-blue-50 bg-white";
              } else {
                if (idx === q.answerIndex) {
                  btnClass += "border-green-500 bg-green-50 text-green-900"; // 正解
                } else if (idx === selectedOption) {
                  btnClass += "border-red-500 bg-red-50 text-red-900"; // 選んだ間違い
                } else {
                  btnClass += "border-gray-200 bg-gray-50 opacity-60"; // その他
                }
              }

              return (
                <button 
                  key={idx} 
                  disabled={isAnswered}
                  onClick={() => handleAnswer(idx)}
                  className={btnClass}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-500 w-6">
                      {['ア', 'イ', 'ウ', 'エ', 'オ'][idx]}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {isAnswered && idx === q.answerIndex && <Check className="text-green-500" />}
                    {isAnswered && idx === selectedOption && idx !== q.answerIndex && <X className="text-red-500" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div className="bg-blue-50 border-t-4 border-blue-500 p-4 md:p-6 rounded-b-lg shadow-sm mb-20 animate-fade-in">
              <h3 className="font-bold text-blue-800 mb-3 text-lg border-b pb-2">解説</h3>
              <div className="text-gray-800 whitespace-pre-wrap leading-relaxed mb-4">
                {q.explanation}
              </div>
              
              {/* 表のレンダリング */}
              {q.table && (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full bg-white border border-gray-300">
                    <tbody>
                      {q.table.map((row, i) => (
                        <tr key={i} className="border-b border-gray-200">
                          <td className="p-3 bg-gray-50 font-bold w-1/3 border-r">{row.term}</td>
                          <td className="p-3">{row.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 図表レイアウト */}
              {q.visual && q.visual}

            </div>
          )}
        </div>

        {/* Footer actions */}
        {isAnswered && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg flex justify-center">
            <button 
              onClick={nextQuestion}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-blue-700 flex items-center gap-2"
            >
              {currentIndex < filteredQuestions.length - 1 ? '次の問題へ' : '結果を見る'} 
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    );
  }

  if (screen === 'result') {
    const correctCount = filteredQuestions.filter(q => userData.answers[q.id] === true).length;
    const total = filteredQuestions.length;
    
    return (
      <div className="flex flex-col h-screen bg-gray-100 items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-2">お疲れ様でした！</h2>
          <p className="text-gray-600 mb-6">選択したモードの全問題を完了しました。</p>
          
          <div className="text-5xl font-extrabold text-blue-600 mb-2">
            {correctCount} <span className="text-2xl text-gray-400">/ {total}</span>
          </div>
          <p className="font-bold text-gray-500 mb-8">正解</p>

          <button 
            onClick={resetAndGoHome}
            className="w-full bg-gray-800 text-white font-bold py-3 rounded hover:bg-gray-900 flex justify-center items-center gap-2"
          >
            <Home size={20} /> ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'history') {
    const totalAnswers = Object.keys(userData.answers).length;
    const correctCount = Object.values(userData.answers).filter(v => v === true).length;
    const wrongCount = totalAnswers - correctCount;

    const chartData = [
      { name: '正解', value: correctCount, color: '#10B981' },
      { name: '不正解', value: wrongCount, color: '#EF4444' }
    ];

    return (
      <div className="flex flex-col min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl w-full mx-auto">
          <div className="flex items-center mb-6">
            <button onClick={() => setScreen('start')} className="mr-4 p-2 bg-white rounded shadow-sm hover:bg-gray-100">
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <h1 className="text-2xl font-bold">学習履歴</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <PieChartIcon className="text-blue-500"/> 全体成績
            </h2>
            {totalAnswers === 0 ? (
              <p className="text-gray-500 text-center py-4">まだ学習データがありません。</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="font-bold text-lg mb-4 border-b pb-2">問題別ステータス</h2>
            <div className="space-y-2">
              {quizData.map(q => {
                const isAns = userData.answers[q.id] !== undefined;
                const isCorrect = userData.answers[q.id] === true;
                const isReview = userData.review[q.id] === true;

                return (
                  <div key={q.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                    <div className="flex-1 truncate pr-4">
                      <span className="text-sm text-gray-500 mr-2">問{q.id}</span>
                      <span className="font-medium text-gray-800">{q.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {isReview && <AlertCircle size={18} className="text-orange-500" title="要復習" />}
                      {!isAns ? (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">未</span>
                      ) : isCorrect ? (
                        <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded font-bold flex items-center"><Check size={14}/>正解</span>
                      ) : (
                        <span className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded font-bold flex items-center"><X size={14}/>不正解</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
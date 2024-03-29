const canvas = document.getElementById('lissajousCanvas');
canvas.width = canvas.offsetWidth;  // 実際の描画幅をCSSの幅に合わせる
canvas.height = canvas.offsetHeight; // 実際の描画高さをCSSの高さに合わせる
const ctx = canvas.getContext('2d');
const aInput = document.getElementById('aValue');
const bInput = document.getElementById('bValue');

const innerColorInput = document.getElementById('innerColor');
const outerColorInput = document.getElementById('outerColor');
const lineColorInput = document.getElementById('lineColor');
const lineWidthInput = document.getElementById('lineWidth');

// 線のxy座標を計算する関数
const A = canvas.width / 2 * 0.8;  // Adjusting amplitude based on the canvas size
const B = canvas.height / 2 * 0.8;
const offsetX = canvas.width / 2;
const offsetY = canvas.height / 2;

function calculateLissajousPoints(a, b) {
    const points = [];
    const avgValue = (a + b) / 2;
    const stepSize = 0.01 / (avgValue / 10);

    for (let t = 0; t < 2 * Math.PI; t += stepSize) {
        const x = A * Math.sin(a * t) + offsetX;
        const y = B * Math.sin(b * t) + offsetY;
        points.push({ x, y });
    }
    return points;
}

function drawLissajousCurve(a, b) {
    // 現在のキャンバスの状態を保存
    ctx.save();        

    const innerColor = innerColorInput.value;
    const outerColor = outerColorInput.value;
    const lineColor = lineColorInput.value;
    const lineWidth = parseFloat(lineWidthInput.value);

    // グラデーションの作成
    const gradient = ctx.createRadialGradient(offsetX, offsetY, 0, offsetX, offsetY, canvas.width / 2);
    gradient.addColorStop(0, innerColor);
    gradient.addColorStop(1, outerColor);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height); // グラデーション背景の適用

    ctx.strokeStyle = lineColor; // 線の色の更新
    ctx.lineWidth = lineWidth;   // 線の太さの更新
    
    // 座標を計算
    const points = calculateLissajousPoints(a, b);

    ctx.beginPath();
    for (const point of points) {
        ctx.lineTo(point.x, point.y);
    }
    ctx.closePath();
    ctx.stroke();

    // クリッピング領域を設定
    ctx.clip();

    // 線の色で塗りつぶし
    ctx.fillStyle = lineColor;

    const fillOption = document.querySelector('input[name="fillOption"]:checked').value;
    if (fillOption === 'fill') {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // クリッピングをリセット
    ctx.restore();
}


// function updateDownloadLink() {
//     const downloadLink = document.getElementById('downloadLink');
//     const dataURL = canvas.toDataURL('image/jpeg');
//     downloadLink.href = dataURL;
//     downloadLink.download = "lissajous.jpg";  // ファイルの拡張子を .png から .jpg に変更
// }

function updateDownloadLink() {
    const downloadLink = document.getElementById('downloadLink');

    // オフスクリーンキャンバスを作成
    let offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = 4000;  // このサイズを適切な値に変更してください
    offscreenCanvas.height = 4000;
    let offscreenCtx = offscreenCanvas.getContext("2d");

    // 現在のcanvasの内容をオフスクリーンcanvasに拡大描画
    offscreenCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

    // オフスクリーンcanvasの内容をJPEG形式で取得
    const dataURL = offscreenCanvas.toDataURL('image/jpeg');
    downloadLink.href = dataURL;
    downloadLink.download = "lissajous.jpg";
}

document.getElementById('downloadLink').addEventListener('click', updateDownloadLink); // ダウンロードリンクのクリック時に高解像度画像生成処理を実行する

function updateAndDraw() {
    const a = parseFloat(aInput.value);
    const b = parseFloat(bInput.value);
    drawLissajousCurve(a, b);
}

// 初期描画
updateAndDraw();

// アニメーション関連
let animationTimerId = null; // setTimeoutのIDを保持する変数

let bValue = 1;
const bMax = 100;
const animationDelay = 100; // 0.5秒

function startAnimation() {
    // 初期値の設定
    bValue = 1;

    // アニメーションの実行
    function step() {
        if (bValue <= bMax) {
            bInput.value = bValue;
            aInput.value = bValue - 1; // aの値をb-1に設定

            updateAndDraw();

            bValue += 2;
            animationTimerId = setTimeout(step, animationDelay); // 次のステップをスケジュール
        }
    }

    step(); // 最初のステップを実行
}

function updateValueDisplay(elementId, value) {
    document.getElementById(elementId + "Display").innerText = value;
}

document.getElementById('startAnimation').addEventListener('click', startAnimation);

document.getElementById('stopAnimation').addEventListener('click', function() {
    if (animationTimerId !== null) {
        clearTimeout(animationTimerId);  // setTimeoutのキャンセル
        animationTimerId = null;
    }
});

// 「おまかせ」ボタンのクリックイベントに結び付ける
document.getElementById('randomizeColors').addEventListener('click', function() {
    innerColorInput.value = generateRandomColor();
    outerColorInput.value = generateRandomColor();
    lineColorInput.value = generateRandomColor();
    updateAndDraw(); // 描画を更新
});

// ランダムな色を返す
function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// ツイート機能
document.getElementById('tweetButton').addEventListener('click', function() {
    const text = encodeURIComponent("リサージュ曲線が簡単に描けます！！");
    const url = encodeURIComponent("https://lissajousdrawingtool.onrender.com/stringart");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
});


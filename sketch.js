let eyes = [];
let eyeSize = 40;
let eyePairSpacing = 40; //눈 쌍 사이의 간격
let eyeSpacing = 20; //눈 한 쌍 내의 간격
let cols, rows;
let blink = false;

let font;
function preload(){
  font = loadFont("Jaro-Regular-VariableFont_opsz.ttf");
}

let AllEyesOnMe = "All Eyes On Me";
let textSizeClick = 20; //텍스트 크기
let textShake = 0.3; //텍스트 떨림값
let fadeColor = 0; //배경색 페이드


function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);

  //행열 계산
  cols = floor(width / ((eyeSize * 2 + eyeSpacing) + eyePairSpacing));
  rows = floor(height / (eyeSize * 1.5));
  //눈 쌍 배열 초기화
  for (let i = 0; i<cols; i++) {
    for (let j = 0; j<rows; j++) {
      let x = eyePairSpacing / 2 + (i + 0.5) * (eyeSize * 2 + eyeSpacing + eyePairSpacing);
      let y = eyeSize + j * eyeSize * 1.5;
      eyes.push(new Eye(x, y, eyeSize));
      eyes.push(new Eye(x + eyeSize + eyeSpacing, y, eyeSize));
    }
  }
}

function draw() {
  //배경색을 페이드
  fadeColor = lerp(fadeColor, 255, 0.004);
  background(fadeColor);

  for (let eye of eyes) {
    eye.update(mouseX, mouseY);
    //blink 변수에 따라 눈 깜빡
    if (blink) {
      eye.close();
    } else {
      eye.open();
    }
    eye.display(mouseX, mouseY);
  }

  let textX = mouseX + random(-textShake / 2, textShake / 2);
  let textY = mouseY + random(-textShake / 2, textShake / 2);
  //마우스에 따라오는 텍스트
  if (!blink) {
    textSize(textSizeClick);
    textAlign(CENTER, CENTER);
    fill(255 - fadeColor); //배경색의 반대로 설정
    text(AllEyesOnMe, textX, textY);
  }
}

function touchEnded() {
  for (let i = 0; i < 10; i++) {
    setTimeout(function() {
      textSizeClick += i / 5;
      textShake += i / 20;
      blink = false;
    }, 2000);
  }
  blink = !blink;
}

class Eye {
  constructor(tx, ty, ts) {
    this.x = tx;
    this.y = ty;
    this.size = ts;
    this.angle = 0;
    this.vx = 0;
    this.vy = 0;
    this.closed = false;
  }

  update(mx, my) {
    this.angle = atan2(my - this.y, mx - this.x);
  }

  display(mx, my) {
    let distance = dist(mx, my, this.x, this.y);
    let redIntensity = map(distance, 0, width, 255, 0);

    push();
    translate(this.x, this.y);

    //흰색 눈 그리기
    fill(255);
    ellipse(0, 0, this.size, this.size);

    if (!this.closed) {
      
    } else {
      //눈감음
      noStroke();
      fill(0);
      rect(-this.size / 1.3, -this.size / 4, this.size * 1.5, this.size / 2);
      //텍스트추가
      if (eyes.indexOf(this) % 2 === 0) {
        fill(255);
        textSize(12);
        textAlign(CENTER, CENTER);
        text("CLOSED", 0, 0); // 눈의 중심에 텍스트를 그립니다.
      }
    }

    //동공
    rotate(this.angle);
    fill(redIntensity, 0, 0);
    noStroke();
    if (!this.closed) {
      ellipse(this.size / 5, 0, this.size / 2, this.size / 2);
    } else {
      noStroke();
      fill(0);
    }
    pop();
  }

  close() {
    this.closed = true;
  }
  open() {
    this.closed = false;
  }
}

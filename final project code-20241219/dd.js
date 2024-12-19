// Teachable Machine에서 생성된 모델 경로
const URL = "my_model/";

let model, labelContainer, maxPredictions;

// 모델을 초기화하고 예측 레이블 컨테이너를 설정하는 함수
async function init() {
    const modelURL = URL + "model.json"; // 모델 정의 파일 경로
    const metadataURL = URL + "metadata.json"; // 메타데이터 파일 경로
    
    try {
        // 모델과 메타데이터를 비동기로 로드
        model = await tmImage.load(modelURL, metadataURL);
        
        maxPredictions = model.getTotalClasses(); // 모델 클래스 개수 가져오기
        console.log(maxPredictions);
        // 예측 결과를 표시할 레이블 컨테이너 초기화
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div")); // 결과를 표시할 div 추가
        }
    } catch (error) {
        console.error("Model loading failed:", error); // 모델 로드 실패 시 오류 출력
    }
}

// 사용자가 이미지를 업로드했을 때 처리하는 함수
function handleImageUpload(event) {
    const file = event.target.files[0]; // 업로드된 파일 가져오기
    console.log(file); // 파일 객체가 제대로 전달되는지 확인
    if (!file) return; // 파일이 없으면 아무 작업도 하지 않음

    const imgElement = document.getElementById("uploadedImage");
    const reader = new FileReader(); // FileReader 객체 생성
    reader.onload = function (e) {
        console.log("File successfully read!");
        imgElement.src = e.target.result; // 이미지 데이터를 img src에 설정
        imgElement.onload = function () {
            console.log("Image successfully loaded!");
            predict(imgElement); // 모델 예측 실행
        };
    };
    reader.readAsDataURL(file);
}

// 모델에 이미지를 입력하고 예측 결과를 화면에 표시하는 함수
async function predict(imageElement) {
    // 모델을 통해 이미지를 예측
    const prediction = await model.predict(imageElement);

    // 예측된 클래스 중 가장 확률이 높은 클래스만 가져오기
    const topPrediction = prediction.reduce((max, current) => {
        return current.probability > max.probability ? current : max;
    });

    // 예측된 클래스 이름
    const className = topPrediction.className;

    // 결과를 표시할 텍스트 색상 설정
    let textColor = "";

    // 클래스 이름에 맞춰 색상 설정
    if (className === "겨울") {
        textColor = "skyblue"; // 하늘색
    } else if (className === "봄") {
        textColor = "#ffccd7"; // 봄은 #fcc7ce 색상 (연한 핑크)
    } else if (className === "여름") {
        textColor = "green"; // 초록색
    } else if (className === "가을") {
        textColor = "#900123"; // 버건디색 (조금 더 부드러운 색)
    }

    // 결과 텍스트와 색상 적용
    labelContainer.innerHTML = className; // 예측된 클래스 이름만 출력
    labelContainer.style.color = textColor; // 기존 색상으로 설정

    // 마우스 올렸을 때 색상 변경
    labelContainer.style.cursor = "pointer"; // 마우스 커서를 클릭 가능한 형태로 변경
    labelContainer.addEventListener("mouseover", function() {
        labelContainer.style.color = getHoverColor(className); // 마우스를 올리면 색상 변경
    });

    // 마우스가 `labelContainer`에서 벗어났을 때 색상 원래대로 돌아가도록 설정
    labelContainer.addEventListener("mouseleave", function() {
        labelContainer.style.color = textColor; // 원래 색상으로 돌아감
    });

    // 클릭 시 계절별 옷차림 정보 페이지로 이동
    labelContainer.onclick = function() {
        if (className === "겨울") {
            window.location.href = "winter.html"; // 겨울 옷차림 페이지로 이동
        } else if (className === "봄") {
            window.location.href = "spring.html"; // 봄 옷차림 페이지로 이동
        } else if (className === "여름") {
            window.location.href = "summer.html"; // 여름 옷차림 페이지로 이동
        } else if (className === "가을") {
            window.location.href = "autumn.html"; // 가을 옷차림 페이지로 이동
        }
    };
}

// 계절별 색상 반환 함수 (마우스를 올렸을 때 색상)
function getHoverColor(season) {
    switch(season) {
        case "봄":
            return "#ea7379"; // 봄 색상 (오렌지)
        case "여름":
            return "#FF8C00"; // 여름 색상 (오렌지)
        case "가을":
            return "#eabe95"; // 가을 색상 (갈색)
        case "겨울":
            return "#26e0f9"; // 겨울 색상 (파란색)
        default:
            return "#000000"; // 기본 색상 (검은색)
    }
}

// 스크립트가 로드될 때 모델을 초기화
init();

// 파일 입력 필드에 이벤트 리스너 추가 (이미지 업로드 처리)
document.getElementById("imageInput").addEventListener("change", handleImageUpload);

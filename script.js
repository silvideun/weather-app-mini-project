const apiKey = '23c964b28c3c56670f651dca3ec7be38';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';

// Получение языка пользователя
function getUserLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    return lang.split('-')[0];
}

// Установка города по умолчанию
function setDefaultCity() {
    const defaultCity = 'Москва';
    getWeather(defaultCity);
}

// Обновление иконки погоды
function updateWeatherIcon(weatherMain) {
    const iconElement = document.querySelector('.weather-icon');
    const weatherCardElement = document.querySelector('.weather-card');

    let iconSrc = '';
    let backgroundClass = '';

    switch (weatherMain) {
        case 'Clear':
            iconSrc = 'img/clear.png';
            backgroundClass = 'clear';
            break;
        case 'Clouds':
            iconSrc = 'img/clouds.png';
            backgroundClass = 'clouds';
            break;
        case 'Drizzle':
            iconSrc = 'img/drizzle.png';
            backgroundClass = 'drizzle';
            break;
        case 'Rain':
            iconSrc = 'img/rain-icon.svg';
            backgroundClass = 'rain';
            break;
        case 'Snow':
            iconSrc = 'img/snow.png';
            backgroundClass = 'snow';
            break;
        default:
            iconSrc = 'img/default.png';
            backgroundClass = 'default';
            break;
    }

    iconElement.src = iconSrc;

    // Удалить старые классы и добавить новый
    weatherCardElement.classList.remove('clear', 'clouds', 'drizzle', 'rain', 'snow', 'default');
    weatherCardElement.classList.add(backgroundClass);

    console.log('Обновление иконки погоды для:', weatherMain);
}

// Установка градиента фона
function setGradientBackground(condition) {
    const weatherCard = document.querySelector('.weather-card');
    const inputElement = document.getElementById('cityInput');
    const buttonElement = document.getElementById('searchButton');

    if (!weatherCard || !inputElement || !buttonElement) return;

    // Определение цветов для разных условий
    let gradient;
    let inputBg, inputBorder, inputTextColor, buttonBg, buttonColor;

    if (condition === 'Clear' || condition === 'Sunny') {
        gradient = 'linear-gradient(to bottom, #FFD700, #87CEEB)';
        inputBg = '#FFFFFF'; // Белый
        inputBorder = '#FFD700'; // Жёлтый
        inputTextColor = '#333333'; // Тёмно-серый (для контраста)
        buttonBg = '#FFD700'; // Жёлтый
        buttonColor = '#FFFFFF'; // Белый
    } else if (condition === 'Clouds') {
        gradient = 'linear-gradient(to bottom, #D3D3D3, #A9A9A9)';
        inputBg = '#D3D3D3'; // Серый
        inputBorder = '#A9A9A9'; // Темно-серый
        inputTextColor = '#000000'; // Чёрный
        buttonBg = '#A9A9A9'; // Темно-серый
        buttonColor = '#000000'; // Чёрный
    } else if (condition === 'Rain' || condition === 'Drizzle') {
        gradient = 'linear-gradient(to bottom, #6495ED, #778899)';
        inputBg = '#6495ED'; // Голубой
        inputBorder = '#778899'; // Темно-голубой
        inputTextColor = '#FFFFFF'; // Белый
        buttonBg = '#778899'; // Темно-голубой
        buttonColor = '#FFFFFF'; // Белый
    } else if (condition === 'Snow') {
        gradient = 'linear-gradient(to bottom, #FFFFFF, #E6E6FA)';
        inputBg = '#FFFFFF'; // Белый
        inputBorder = '#E6E6FA'; // Лавандовый
        inputTextColor = '#333333'; // Тёмно-серый (для контраста)
        buttonBg = '#E6E6FA'; // Лавандовый
        buttonColor = '#FFFFFF'; // Белый
    } else if (condition === 'Thunderstorm') {
        gradient = 'linear-gradient(to bottom, #2F4F4F, #000000)';
        inputBg = '#2F4F4F'; // Тёмно-зелёный
        inputBorder = '#000000'; // Чёрный
        inputTextColor = '#FFFFFF'; // Белый
        buttonBg = '#000000'; // Чёрный
        buttonColor = '#FFFFFF'; // Белый
    } else {
        gradient = 'linear-gradient(to bottom, #F0F8FF, #E6E6FA)';
        inputBg = '#FFFFFF'; // Белый
        inputBorder = '#CCCCCC'; // Серый
        inputTextColor = '#333333'; // Тёмно-серый
        buttonBg = '#007BFF'; // Голубой
        buttonColor = '#FFFFFF'; // Белый
    }

    // Применение градиента к .weather-card
    weatherCard.style.background = gradient;

    // Применение стилей к input
    inputElement.style.backgroundColor = inputBg;
    inputElement.style.borderColor = inputBorder;
    inputElement.style.color = inputTextColor; // Добавляем цвет текста

    // Применение стилей к button
    buttonElement.style.backgroundColor = buttonBg;
    buttonElement.style.color = buttonColor;
}

// Основная функция получения погоды
async function getWeather(city) {
    if (!city) {
        alert('Введите название города!');
        return;
    }
    try {
        const userLang = getUserLanguage();
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}&lang=${userLang}`);
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        document.getElementById('city').textContent = data.name;
        document.getElementById('temp').textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('wind').textContent = `${(data.wind.speed * 3.6).toFixed(1)} км/ч`;
        updateWeatherIcon(data.weather[0].main); // Обновление иконки
        setGradientBackground(data.weather[0].main); // Установка фона
    } catch (error) {
        console.error('Произошла ошибка:', error.message);
        document.getElementById('city').textContent = 'Город не найден';
        document.getElementById('temp').textContent = '—';
        document.getElementById('humidity').textContent = '—';
        document.getElementById('wind').textContent = '—';
    }
}

// Вызов функции при загрузке страницы
window.onload = setDefaultCity;

// Обработчик события для кнопки поиска
document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        getWeather(city);
    } else {
        alert('Введите название города!');
    }
});
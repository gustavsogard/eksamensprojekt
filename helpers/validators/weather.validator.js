exports.getCorrectIcon = (weathercode) => {
    let symbol;
    switch (weathercode) {
        case 0:
            symbol = 'clear_day';
            break;
        case 1:
        case 2:
            symbol = 'partly_cloudy_day'
            break;
        case 3:
            symbol = 'cloudy';
            break;
        case 45:
        case 48:
            symbol = 'foggy';
            break;
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            symbol = 'cloudy_snowing';
            break;
        case 95:
        case 96:
        case 99:
            symbol = 'thunderstorm';
            break;
        default:
            symbol = 'rainy';
    }
    return symbol;
}

const NormalDate = (num) => {
  const hours = Math.floor(num / 3600);
  const minutes = Math.floor((num % 3600) / 60);
  const seconds = num % 60;

  const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  return formattedTime;
};

const padZero = (number) => {
  return number.toString().padStart(2, '0');
};
  
  export default NormalDate;
  
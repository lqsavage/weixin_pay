/**
 * 根据传入的出生日期计算年龄
 */

function parseDate(str) {
  if(!str){
    return;
  }
  if(str instanceof Date){
    return str
  }else {
    if(str.match(/^\d{4}[\-\/\s+]\d{1,2}[\-\/\s+]\d{1,2}$/)){
      return new Date(str.replace(/[\-\/\s+]/i,'/'));
    }
    else if(str.match(/^\d{8}$/)){
      return new Date(str.substring(0,4)+'/'+str.substring(4,6)+'/'+str.substring(6));
    }
    else{
      console.log('出生日期格式错误');
      return;
    }
  }
}

export function getAgeByBirthday(brDay) {
  let age = -1;
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth()+1;
  const todayDay = today.getDate();
  const birthday = parseDate(brDay);
  if(parseDate(birthday)) {
    const birthdayYear=birthday.getFullYear();
    const birthdayMonth=birthday.getMonth();
    const birthdayDay=birthday.getDate();
    if(todayYear-birthdayYear<0)
    {
      console.log("出生日期错误!");
    } else {
      if(todayMonth - birthdayMonth < 0)
      {
        age = (todayYear - birthdayYear) - 1;
      } else {
        if(todayDay-birthdayDay >= 0)
        {
          age = (todayYear - birthdayYear);
        } else {
          age = (todayYear - birthdayYear) - 1;
        }
      }
    }
    return age;
  } else {
    return '--';
  }
}
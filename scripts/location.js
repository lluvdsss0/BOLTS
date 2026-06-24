const locationData = {
  greenMain: {
    title: "ГЛАВНЫЙ ЗАЛ",
    text: "В главном зале находится большой <br />игральный стол, где вы можете <br />посоревноваться за детали.",
    image: "svg/locationInfoMain1.svg"
  },

  greenTVs: {
    title: "ЗОНА ЭКРАНОВ",
    text: "Здесь расположены экраны, <br />на которых показываются правила, <br />события и результаты игр.",
    image: "svg/locationInfoTVs1.svg"
  },

  greenProvods: {
    title: "ПРОВОДА",
    text: "Техническая часть локации: <br />кабели, соединения и механизмы, <br />которые запускают игровые системы.",
    image: "svg/locationInfoProvods1.svg"
  },

  greenTonnels: {
    title: "ТОННЕЛИ",
    text: "Тоннели соединяют части пространства <br />и создают ощущение маршрута <br />внутри игровой системы.",
    image: "svg/locationInfoTonnels1.svg"
  }
};

const schemePoints = document.querySelectorAll(".schemePoint");

const locationInfo = document.querySelector(".locationInfo");
const locationTitle = document.querySelector("#locationInfoTitle");
const locationText = document.querySelector("#locationInfoText");
const locationImage = document.querySelector(".locationInfoImage");

schemePoints.forEach((point) => {
  point.addEventListener("click", () => {
    const pointId = point.id;
    const data = locationData[pointId];

    if (!data) return;

    schemePoints.forEach((item) => {
      item.classList.remove("active");
    });

    point.classList.add("active");

    locationInfo.classList.remove("show");

    setTimeout(() => {
      locationTitle.textContent = data.title;
      locationText.innerHTML = data.text;
      locationImage.src = data.image;

      locationInfo.classList.add("show");
    }, 150);
  });
});

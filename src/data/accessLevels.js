const accessLevels = [
  "",
  "Только просмотр, прогноз скрыт", // 1
  "Только просмотр, прогноз виден", // 2
  "Можно сделать предложение, прогноз скрыт", // 3
  "Можно сделать предложение, прогноз виден", // 4
  "Можно редактировать текущие позиции", // 5
  "Можно редактировать, добавлять, удалять" // 6
];

const accessLevelsEstimates = [
  {
    level: 1,
    label: "Только просмотр, прогноз скрыт"
  }, {
    level: 2,
    label: "Только просмотр, прогноз виден"
  }, {
    level: 3,
    label: "Можно сделать предложение, прогноз скрыт"
  }, {
    level: 4,
    label: "Можно сделать предложение, прогноз виден"
  }, {
    level: 5,
    label: "Можно редактировать текущие позиции"
  }, {
    level: 6,
    label: "Можно редактировать, добавлять, удалять"
  },
];

const accessLevelsAlbums = [
  {
    level: "view",
    label: "Только просмотр"
  },
  {
    level: "edit",
    label: "Можно смотреть, загружать и удалять"
  }
];

const accessLevelsFiles = [
  {
    level: "view",
    label: "Только просмотр"
  },
  {
    level: "edit",
    label: "Просмотр и редактирование"
  }
]


export { accessLevels, accessLevelsEstimates, accessLevelsAlbums, accessLevelsFiles };

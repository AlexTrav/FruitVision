# соответствие английских названий классов датасета русским, для отображения на фронтенде
CLASS_NAME_RU: dict[str, str] = {
    "apple": "Яблоко",
    "banana": "Банан",
    "beetroot": "Свёкла",
    "bell pepper": "Болгарский перец",
    "cabbage": "Капуста",
    "capsicum": "Перец (капсикум)",
    "carrot": "Морковь",
    "cauliflower": "Цветная капуста",
    "chilli pepper": "Перец чили",
    "corn": "Кукуруза",
    "cucumber": "Огурец",
    "eggplant": "Баклажан",
    "garlic": "Чеснок",
    "ginger": "Имбирь",
    "grapes": "Виноград",
    "jalepeno": "Перец халапеньо",
    "kiwi": "Киви",
    "lemon": "Лимон",
    "lettuce": "Салат латук",
    "mango": "Манго",
    "onion": "Лук",
    "orange": "Апельсин",
    "paprika": "Паприка",
    "pear": "Груша",
    "peas": "Горох",
    "pineapple": "Ананас",
    "pomegranate": "Гранат",
    "potato": "Картофель",
    "raddish": "Редис",
    "soy beans": "Соевые бобы",
    "spinach": "Шпинат",
    "sweetcorn": "Сладкая кукуруза",
    "sweetpotato": "Батат",
    "tomato": "Помидор",
    "turnip": "Репа",
    "watermelon": "Арбуз",
}


# переводит английское имя класса в русское; если перевода нет – возвращает как есть
def to_ru(class_name: str) -> str:
    return CLASS_NAME_RU.get(class_name, class_name)

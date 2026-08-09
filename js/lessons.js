// Lesson data loader
// The split lesson files are loaded synchronously before building lessonsData.
// This keeps lessons.html simple while allowing each lesson to live in its own file.
const lessonFiles = Array.from({ length: 25 }, (_, i) => `/japanese-lang/js/lessons/lesson${i + 1}.js`);

lessonFiles.forEach(src => {
    document.write(`<script src="${src}"><\/script>`);
});

const lessonsData = {
    lesson1,
    lesson2,
    lesson3,
    lesson4,
    lesson5,
    lesson6,
    lesson7,
    lesson8,
    lesson9,
    lesson10,
    lesson11,
    lesson12,
    lesson13,
    lesson14,
    lesson15,
    lesson16,
    lesson17,
    lesson18,
    lesson19,
    lesson20,
    lesson21,
    lesson22,
    lesson23,
    lesson24,
    lesson25
};

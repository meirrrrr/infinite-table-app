import { server } from "./server";
import "@testing-library/jest-dom";

// Запускаем MSW перед всеми тестами:
beforeAll(() => server.listen());
// Сбрасываем любые перехватчики между тестами (чтобы чисто мокать под каждый тест):
afterEach(() => server.resetHandlers());
// Останавливаем MSW после всех тестов
afterAll(() => server.close());

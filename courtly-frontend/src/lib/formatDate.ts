export default function formatDate(date: string) {
    const d = new Date(date);

    return `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
    ).padStart(2, "0")}/${String(d.getFullYear()).slice(-2)}, ${String(
        d.getHours() % 12 || 12
    ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} ${
        d.getHours() >= 12 ? "PM" : "AM"
    }`;
}
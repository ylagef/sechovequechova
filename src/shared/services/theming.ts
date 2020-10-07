import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

export async function handleTheme(initial: boolean, setTheme: any, theme?: string) {
    if (initial) {
        const savedTheme = (await Storage.get({
            key: "theme",
        })).value;

        (savedTheme) ? persistTheme(savedTheme, false, setTheme) : persistTheme('dark', true, setTheme);
    } else if (theme) {
        persistTheme(theme, true, setTheme);
    }

    console.warn('Handle theme called and did nothing.');
}

async function persistTheme(theme: string, storage: boolean, setTheme: any) {
    if (storage) {
        await Storage.set({
            key: "theme",
            value: theme,
        });
    }

    setTheme(theme);
    toggleDark(theme === "dark");
}

function toggleDark(toggle: boolean) {
    document.body.classList.toggle(
        "dark",
        toggle
    );
}
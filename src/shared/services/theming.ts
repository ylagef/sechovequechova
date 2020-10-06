import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

export async function handleTheme(initial: boolean, setTheme: any, theme?: string) {
    if (initial) {
        console.log('Initial theme handling...');
        const savedTheme = (await Storage.get({
            key: "theme",
        })).value;

        console.log('Saved', savedTheme);
        if (savedTheme) {
            document.body.classList.toggle(
                "dark",
                savedTheme === "dark"
            );
            setTheme(savedTheme);
        } else {
            await Storage.set({
                key: "theme",
                value: 'dark',
            });
            setTheme('dark');
            document.body.classList.toggle(
                "dark",
                true
            );
        }
    } else if (theme) {
        console.log('Change theme handling...', theme);

        document.body.classList.toggle(
            "dark",
            theme === "dark"
        );

        setTheme(theme);
        await Storage.set({
            key: "theme",
            value: theme,
        });
    }

    // const newTheme = !initial
    //     ? savedTheme === "dark"
    //         ? "light"
    //         : "dark"
    //     : savedTheme;

    // document.body.classList.toggle(
    //     "dark",
    //     savedTheme ? savedTheme === "dark" : true
    // );

}

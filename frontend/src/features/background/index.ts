import { settings } from "$shared/services";
import SettingsPage from "./SettingsPage.svelte";

settings.registerPage({
  id: "background",
  title: "Фон",
  component: SettingsPage,
  order: 9
});

export { default as BackgroundShow } from "./BackgroundShow.svelte";
import { settings } from "$shared/services";
import SettingsPage from "./SettingsPage.svelte";

settings.registerPage({
  id: "appearance",
  title: "Оформление",
  component: SettingsPage,
  order: 10
});

export let init = "yes";
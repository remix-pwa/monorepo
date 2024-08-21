// Vite ✨
export { remixPWA } from "./src/index.js";
export type { PWAOptions as PWAViteOptions } from "./src/types.js";

export interface WebAppManifest {
  /**
   * The name member is a string that represents the name of the web application as it is usually
   * displayed to the user (e.g., amongst a list of other applications, or as a label for an icon).
   */
  name?: string;
  /**
   * The short_name member is a string that represents the name of the web application displayed to the
   * user if there is not enough space to display name.
   */
  short_name?: string;
  /**
   * The description member is a string that provides a description of the purpose of the web application.
   */
  description?: string;
  /**
   * The icons member specifies an array of image objects that can serve as application icons for different
   * contexts. For example, they can be used to represent the web application amongst a list of other applications,
   * or to integrate the web application with an operating system's task switcher and/or system preferences.
   */
  icons?: Array<{
    src: string;
    sizes?: string;
    type?: string;
    purpose?: "any" | "maskable" | "monochrome";
  }>;
  /**
   * The start_url member is a string that represents the start URL of the web application — the preferential URL that
   * should be loaded when the user launches the web application (e.g., when the user taps on the web application's icon
   * from a device's application menu or homescreen).
   */
  start_url?: string;
  /**
   * The display member is a string that determines the developers’ preferred display mode for the website.
   * The display mode changes how much of browser UI is shown to the user and can range from a browser (when the full
   * browser window is shown) to standalone (when the app is run without any browser UI).
   *
   * The default for display is `browser`, which results in the normal browser UI being shown.
   *
   * The full options are:
   * - `fullscreen`: All of the available display area is used and no user agent chrome is shown.
   * - `standalone`: The application will look and feel like a standalone application. This can include the application having a different window, its own icon in the application launcher, etc.
   * - `minimal-ui`: The application will look and feel like a standalone application, but will have a minimal set of UI elements for controlling navigation.
   * - `browser`: The application opens in a conventional browser tab or new window, depending on the browser and platform.
   */
  display?: "fullscreen" | "standalone" | "minimal-ui" | "browser";
  display_override?: Array<"window-controls-overlay" | "bordered" | "standard">;
  /**
   * The orientation member is a string that represents the default orientation of the web application.
   * The value must be a string set to one of the following values:
   * - `any`
   * - `natural`
   * - `landscape`
   * - `landscape-primary`
   * - `landscape-secondary`
   * - `portrait`
   * - `portrait-primary`
   * - `portrait-secondary`
   */
  orientation?:
    | "any"
    | "natural"
    | "landscape"
    | "landscape-primary"
    | "landscape-secondary"
    | "portrait"
    | "portrait-primary"
    | "portrait-secondary";
  /**
   * The dir member is a string that represents the directionality of the web application.
   *
   * The value must be a string set to one of the following values:
   * - `ltr`: Left to right
   * - `rtl`: Right to left
   * - `auto`: Let the user agent decide based on the value of the `lang` attribute on the root element
   */
  dir?: "ltr" | "rtl" | "auto";
  /**
   * The lang member is a string that represents the primary language for the [localizable members](https://www.w3.org/TR/appmanifest/#dfn-localizable-members)
   * of the manifest (as knowing the language can also help with directionality).
   */
  lang?: string;
  prefer_related_applications?: boolean;
  related_applications?: Array<{
    platform: string;
    url?: string;
    id?: string;
    min_version?: string;
    fingerprints?: Array<{
      type: string;
      value: string;
    }>;
  }>;
  /**
   * The scope member is a string that represents the navigation scope of this web application's application context.
   */
  scope?: string;
  screenshots?: Array<{
    src: string;
    sizes?: string;
    type?: string;
    platform?: string;
    label?: string;
    form_factor?: "narrow" | "wide";
  }>;
  shortcuts?: Array<{
    name?: string;
    short_name?: string;
    description?: string;
    url?: string;
    icons?: Array<{
      src: string;
      sizes?: string;
      type?: string;
      purpose?: "any" | "maskable" | "monochrome";
    }>;
  }>;
  share_target?: {
    action?: string;
    method?: "GET" | "POST";
    enctype?: string;
    params?: {
      [key: string]: {
        name?: string;
        title?: string;
        description?: string;
      };
    };
  };
  protocol_handlers?: Array<{
    protocol: string;
    url: string;
  }>;
  note?: string;
  /**
   * The background_color member defines a placeholder background color for the application page to display before its stylesheet is loaded.
   */
  background_color?: string;
  /**
   * The theme_color member is a string that defines the default theme color for the application.
   */
  theme_color?: string;
  categories?: Array<string>;
  iarc_rating_ids?: Array<string>;
}

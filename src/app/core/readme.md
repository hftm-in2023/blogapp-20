# 📁 Core-Verzeichnis (`src/app/core`)

Das `core`-Verzeichnis enthält **nicht-domänenspezifische Features**, die in der gesamten Anwendung verwendet werden. Es ist der Ort für globale Infrastruktur wie Authentifizierung, Layout, globale Stores, Interceptors oder Error Handling.

## 📐 Strukturprinzipien

- 📌 **Feature-orientiert statt technisch gruppiert**  
  Vermeide Ordner wie `services/`, `components/`, `interceptors/` auf oberster Ebene. Stattdessen:
  - ✅ `auth/` statt `services/auth/`
  - ✅ `layout/` statt `components/layout/`

- 📌 **Ein Ordner pro Feature**  
  Jedes Feature im `core`-Ordner bekommt seinen eigenen Ordner, z. B.:
  - `auth/`
  - `layout/`
  - `error/`
  - `state/`
  - `static/`
  - `header/`

---

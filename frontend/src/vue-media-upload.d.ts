// vue-media-upload.d.ts
declare module "vue-media-upload" {
  import { DefineComponent } from "vue";

  export interface UploadMedia {
    name: string;
    [key: string]: any; // extra metadata like url, size, etc.
  }

  export interface UploadHeaders {
    [key: string]: string;
  }

  export interface UploadrProps {
    isInvalid?: boolean;
    media?: UploadMedia[];
    max?: number;
    maxFilesize?: number; // in MB
    accept?: string;
    multiple?: boolean;
  }

  export interface UploadrEvents {
    init?: (media: UploadMedia[]) => void;
    change?: (media: UploadMedia[]) => void;
    add?: (file: UploadMedia, addedFiles: UploadMedia[]) => void;
    remove?: (file: UploadMedia, remainingFiles: UploadMedia[]) => void;
    max?: () => void;
    "max-filesize"?: (file: UploadMedia) => void;
  }

  const Uploadr: DefineComponent<
    UploadrProps,
    {},
    {},
    {},
    {},
    {},
    {},
    UploadrEvents
  >;
  export default Uploadr;
}

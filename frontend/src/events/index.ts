import mitt from "mitt";

type Events = {
  "already-exists": {
    message: string;
    type: string;
  };
};

export const emitter = mitt<Events>();

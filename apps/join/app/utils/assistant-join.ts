export interface FormFillEventData {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  skills?: string;
  professionalExperience?: string;
  portfolioUrl?: string;
}

export const FORM_FILL_EVENT = "formFillEvent";

//  Dispatch form fill event with data

export const dispatchFormFillEvent = (data: FormFillEventData) => {
  const event = new CustomEvent(FORM_FILL_EVENT, {
    detail: data,
  });
  window.dispatchEvent(event);
};

//  Listen for form fill events

export const onFormFillEvent = (
  callback: (data: FormFillEventData) => void
) => {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<FormFillEventData>;
    callback(customEvent.detail);
  };

  window.addEventListener(FORM_FILL_EVENT, handler);

  // Return cleanup function
  return () => {
    window.removeEventListener(FORM_FILL_EVENT, handler);
  };
};

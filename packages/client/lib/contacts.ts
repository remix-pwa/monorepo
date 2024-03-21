type ContactInfo = Array<'name' | 'email' | 'tel' | 'address' | 'icon'>;

export const openContactPicker = async (contactInfo: ContactInfo, multiple = true) => {
  if (navigator && 'contacts' in navigator && 'ContactsManager' in window) {
    try {
      const contacts = await (navigator as any).contacts.select(contactInfo, {
        multiple,
      });
      return contacts;
    } catch (err) {
      console.error('Error opening contact picker:', err);
    }
  } else {
    console.warn('Contact Picker API is not supported');
  }
};

import { EntryFieldTypes, Entry } from 'contentful';

export interface ICardFields {
  title: EntryFieldTypes.Text;
  category: EntryFieldTypes.Text;
  description: EntryFieldTypes.Text;
  image: EntryFieldTypes.AssetLink;
}

export interface ICard {
  contentTypeId: 'card';
  fields: ICardFields;
}

export interface ICardsSectionFields {
  internalName: EntryFieldTypes.Text;
  title: EntryFieldTypes.Text;
  cards: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ICard>>;
}

export interface ICardsSection {
  contentTypeId: 'cardsSection';
  fields: ICardsSectionFields;
}

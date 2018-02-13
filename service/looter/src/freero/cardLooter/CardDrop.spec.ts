import {CardDrop} from "./CardDrop";

describe('CardDrop', () => {
   it('should build correctly', () => {
       const card = "Poring Card";
       const owner = "KudesniK";
       const date = new Date();

       const cardDrop = new CardDrop(card, owner, date);

       expect(cardDrop).toBeInstanceOf(CardDrop);
       expect(cardDrop.card).toEqual(card);
       expect(cardDrop.owner).toEqual(owner);
       expect(cardDrop.date).toEqual(date);
   })
});
import {strToArr} from "../misc/utils";

describe("Payment Utils", () => {
  describe("String to array convertor", () => {
    test("converts to string to array", () => {
      const input = "a,b,c,d,e,f\ng,h,i,j,k,l,m";
      const actualArr = strToArr(input);
      const expectedArr =
          [ [ "a", "b", "c", "d", "e" ,"f"], [ "g", "h", "i", "j", "k", "l" , "m"] ]
      expect(actualArr).toEqual(expectedArr);
    });
  });
});

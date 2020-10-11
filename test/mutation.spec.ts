import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, waitFor } from "@testing-library/svelte";

import Mutation from "../stories/mutation/Mutation.svelte";

describe("Mutation", () => {
  it("should return a response on mutate", async () => {
    const { getByText, getAllByText, queryByText } = render(Mutation);
    //@ts-ignore
    expect(queryByText("My response")).toBeFalsy();
    fireEvent.click(getByText("mutate"));
    await waitFor(() => getAllByText("My response"));
  });
});

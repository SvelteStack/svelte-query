import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, waitFor } from "@testing-library/svelte";

import Hydration from "../stories/hydration/App.svelte";

describe("Hydration", () => {
    it("should render the first query with the cached data", async () => {
        const { getByText, getAllByText } = render(Hydration);
        // cached data
        //@ts-ignore Property 'toBeInTheDocument' does not exist on type 'JestMatchersShape'
        expect(getByText("My cached data")).toBeInTheDocument();
        // refetch Query
        fireEvent.click(getByText("refetch Query"));
        await waitFor(() => getAllByText("Query loading..."));
        await waitFor(() => getAllByText("My Data"));
    });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NuqsTestingAdapter, type UrlUpdateEvent } from "nuqs/adapters/testing";
import { expect, it, vi } from "vitest";
import { CounterButton } from "./counter-button";

it("should increment the count when clicked", async () => {
  const user = userEvent.setup();
  const onUrlUpdate = vi.fn<[UrlUpdateEvent]>();
  render(<CounterButton />, {
    // 1. Setup the test by passing initial search params / querystring:
    wrapper: ({ children }) => (
      <NuqsTestingAdapter searchParams="?count=42" onUrlUpdate={onUrlUpdate}>
        {children}
      </NuqsTestingAdapter>
    ),
  });
  // 2. Act
  const button = screen.getByRole("button");
  await user.click(button);
  // 3. Assert changes in the state and in the (mocked) URL
  expect(button).toHaveTextContent("count is 43");
  expect(onUrlUpdate).toHaveBeenCalledOnce();
  expect(onUrlUpdate.mock.calls[0][0].queryString).toBe("?count=43");
  expect(onUrlUpdate.mock.calls[0][0].searchParams.get("count")).toBe("43");
  expect(onUrlUpdate.mock.calls[0][0].options.history).toBe("push");
});

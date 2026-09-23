WIPBatch in this context: a WIPBatch is a trackable quantity of a single Product moving through
the shop floor together — the operational counterpart to Product.currentStage. Where a Product's
currentStage marks its position in the overall NPI lifecycle (Design -> Development ->
Manufacturing -> Quality -> Shipping), a WIPBatch's currentStation marks exactly where a specific
run of units physically sits on the floor right now (the current_station enum below).
WIPBatchService.updateStation() is the only supported way to move a batch between stations, and
validates the incoming value against CURRENT_STATIONS before writing it.

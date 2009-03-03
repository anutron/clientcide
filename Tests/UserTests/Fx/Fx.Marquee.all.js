{
	tests: [
		{
			title: "Fx.Marquee",
			description: "Displays a series of messages to the user.",
			verify: "Did the messages appear (there were 4 of them)?",
			before: function(){
			
				var fxmq = new Fx.Marquee($('foo'), {
					duration: 500,
					showEffect: {
						top: [0,0], //reset the top every time to zero
						left: [-100, 0],
						opacity: [0,1]
					},
					hideEffect: {
						top: 20
					},
					revertEffect: {
						top: [-30, 0],
						left: [0,0] //reset the left back to zero on revert
					}
				});
				
				fxmq.announce({
						message: 'Yo mama so fat...',
						delay: 1200, revert: false
				}).chain(function(){
					fxmq.announce({
						message: 'When I yell "Kool-aid" she comes crashin\' through the wall!',
						delay: 2000, revert: false
					});
				}).chain(function(){
					fxmq.announce({
						message: 'Oh Yeah? Well, you mamma so poor, I saw her walkin\' down the street the other day kicking an empty can and I asked, "What are you doin\'?" and she said...',
						delay: 4000, revert: false
					});
				}).chain(function(){
					fxmq.announce({
						message: 'Movin\'',
						delay: 1500, revert: true,
						showEffect: {
							top: [0,0],
							left: [500, 0],
							opacity: [0,1]
						},
						hideEffect: {
							top: [0,0],
							left: [0, 500]
						}
					});
				});
			
			}
		}
	]
}
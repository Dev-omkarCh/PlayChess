import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import { FaNoteSticky } from 'react-icons/fa6';
import { Button } from './ui/button';
import { Description } from '@radix-ui/react-dialog';

const StrickersDailog = ({ onSend, stickers }) => {

    return (
      <Dialog>
      {/* Trigger button */}
      <DialogTrigger asChild>
        <Button data-tooltip-id="stickers" size="icon" className="bg-primary hover:bg-secondaryVaraintHover text-lg rounded-xl shadow-md">
          <FaNoteSticky />
        </Button>
      </DialogTrigger>

      {/* Dialog content */}
      <DialogContent className="max-w-md bg-secondary border-none">
        <DialogTitle className="text-white text-center mb-2">Stickers</DialogTitle>
        <Description className='text-gray-300 text-sm text-center'>
          Choose a Sticker and have some meme battle with your noob friend
        </Description>

        <div className="grid grid-cols-4 gap-4">
          {stickers.map((sticker, idx) => {
            if(sticker.type === "image") return (
            <button
              key={idx}
              variant="ghost"
              className="rounded-xl p-2 transition"
              onClick={() => onSend(sticker.content, "image")}
            >
              <img
                src={sticker.content}
                alt={`sticker-${idx}`}
                className="w-16 h-16 object-contain mx-auto hover:opacity-80"
              />
            </button>
          )})}
        </div>
      </DialogContent>
    </Dialog>
    );
};

export default StrickersDailog;
